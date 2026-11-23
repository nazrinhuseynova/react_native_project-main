import {
  isAuthError,
  isAuthRetryableFetchError,
  type AuthError as SupabaseAuthError,
  type Session as SupabaseSession,
  type User as SupabaseUser,
} from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { AuthError, type AuthErrorReason } from '@/core/errors/AuthError';
import { NetworkError } from '@/core/errors/NetworkError';

import type { AuthUser } from '../../domain/entities/AuthUser';
import type { Session } from '../../domain/entities/Session';

export function toAuthUser(user: SupabaseUser): AuthUser {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const avatar = metadata?.avatar_url;
  const provider = user.app_metadata?.provider;

  return {
    id: user.id,
    email: user.email ?? '',
    emailConfirmed: !!user.email_confirmed_at,
    provider: typeof provider === 'string' ? provider : 'email',
    avatarUrl: typeof avatar === 'string' ? avatar : null,
    createdAt: user.created_at,
  };
}

export function toSession(session: SupabaseSession): Session {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? null,
    user: toAuthUser(session.user),
  };
}

function toReason(error: SupabaseAuthError): AuthErrorReason {
  switch (error.code) {
    case 'invalid_credentials':
      return 'invalid_credentials';
    case 'email_not_confirmed':
      return 'email_not_confirmed';
    case 'user_already_exists':
    case 'email_exists':
      return 'user_already_exists';
    case 'weak_password':
      return 'weak_password';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
    case 'over_sms_send_rate_limit':
      return 'too_many_attempts';
    case 'otp_expired':
      return 'otp_expired';
    case 'session_expired':
    case 'session_not_found':
    case 'refresh_token_not_found':
    case 'refresh_token_already_used':
      return 'session_expired';
    case 'validation_failed':
      return 'otp_invalid';
    default:
      break;
  }

  if (error.status === 429) return 'too_many_attempts';
  if (/invalid login credentials/i.test(error.message)) return 'invalid_credentials';
  if (/already (registered|exists)/i.test(error.message)) return 'user_already_exists';
  if (/(token|otp|code)/i.test(error.message) && /(invalid|expired)/i.test(error.message)) {
    return 'otp_invalid';
  }
  if (error.status === 401 || error.status === 403) return 'unauthorized';
  return 'unknown';
}

export function toAuthError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isAuthRetryableFetchError(error)) {
    return new NetworkError(error.message, { reason: 'offline', cause: error });
  }

  if (isAuthError(error)) {
    return new AuthError(error.message, {
      reason: toReason(error),
      cause: error,
      details: { code: error.code, status: error.status },
    });
  }

  if (error instanceof TypeError && /network request failed/i.test(error.message)) {
    return new NetworkError(error.message, { reason: 'offline', cause: error });
  }

  return new AuthError(error instanceof Error ? error.message : 'Unknown auth error', {
    cause: error,
  });
}