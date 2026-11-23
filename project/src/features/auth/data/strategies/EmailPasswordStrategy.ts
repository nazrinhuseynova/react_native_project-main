import type { SupabaseClient } from '@supabase/supabase-js';

import { AuthError } from '@/core/errors/AuthError';

import { normalizeEmail } from '../../domain/entities/AuthUser';
import type { Session } from '../../domain/entities/Session';
import type {
  AuthStrategy,
  SignInCredentials,
  SignUpInput,
  SignUpResult,
} from '../../domain/strategies/AuthStrategy';
import { toAuthError, toSession } from '../mappers/sessionMapper';

export class EmailPasswordStrategy implements AuthStrategy {
  readonly id = 'email_password' as const;
  readonly kind = 'email_password' as const;
  readonly order = 10;
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async signIn(credentials: SignInCredentials): Promise<Session> {
    if (credentials.kind !== 'email_password') {
      throw new AuthError('Unsupported credentials', { reason: 'unknown' });
    }

    const { data, error } = await this.client.auth.signInWithPassword({
      email: normalizeEmail(credentials.email),
      password: credentials.password,
    });
    if (error) throw toAuthError(error);
    if (!data.session) throw new AuthError('Sign-in returned no session', { reason: 'unknown' });
    return toSession(data.session);
  }

  async signUp(input: SignUpInput): Promise<SignUpResult> {
    const { data, error } = await this.client.auth.signUp({
      email: normalizeEmail(input.email),
      password: input.password,
    });
    if (error) throw toAuthError(error);

    // Email təsdiqi açıq olanda mövcud email üçün Supabase xəta qaytarmır,
    // amma `identities` boş massiv olur.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new AuthError('User already exists', { reason: 'user_already_exists' });
    }

    return {
      session: data.session ? toSession(data.session) : null,
      needsEmailConfirmation: !data.session,
    };
  }
}