import type { SupabaseClient } from '@supabase/supabase-js';

import { AuthError } from '@/core/errors/AuthError';

import { normalizeEmail } from '../../domain/entities/AuthUser';
import type { Session } from '../../domain/entities/Session';
import type { AuthStrategy, SignInCredentials } from '../../domain/strategies/AuthStrategy';
import { toAuthError, toSession } from '../mappers/sessionMapper';

export class EmailOtpStrategy implements AuthStrategy {
  readonly id = 'email_otp' as const;
  readonly kind = 'email_otp' as const;
  readonly order = 30;
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  /** Emailə birdəfəlik kod göndərir (yalnız mövcud istifadəçilər üçün). */
  async requestCode(email: string): Promise<void> {
    const { error } = await this.client.auth.signInWithOtp({
      email: normalizeEmail(email),
      options: { shouldCreateUser: false },
    });
    if (error) throw toAuthError(error);
  }

  async signIn(credentials: SignInCredentials): Promise<Session> {
    if (credentials.kind !== 'email_otp') {
      throw new AuthError('Unsupported credentials', { reason: 'unknown' });
    }

    const { data, error } = await this.client.auth.verifyOtp({
      email: normalizeEmail(credentials.email),
      token: credentials.code,
      type: 'email',
    });
    if (error) throw toAuthError(error);
    if (!data.session) throw new AuthError('Verification returned no session', { reason: 'otp_invalid' });
    return toSession(data.session);
  }
}