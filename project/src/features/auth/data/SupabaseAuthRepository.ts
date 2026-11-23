import {
  isAuthSessionMissingError,
  type AuthChangeEvent,
  type SupabaseClient,
} from '@supabase/supabase-js';

import { AuthError } from '@/core/errors/AuthError';

import type { Session } from '../domain/entities/Session';
import type {
  AuthRepository,
  AuthStateEvent,
  AuthStateListener,
  SignOutScope,
  VerifyOtpInput,
} from '../domain/repositories/AuthRepository';
import { toAuthError, toSession } from './mappers/sessionMapper';

const EVENT_MAP: Partial<Record<AuthChangeEvent, AuthStateEvent>> = {
  INITIAL_SESSION: 'initialSession',
  SIGNED_IN: 'signedIn',
  SIGNED_OUT: 'signedOut',
  TOKEN_REFRESHED: 'tokenRefreshed',
  PASSWORD_RECOVERY: 'passwordRecovery',
  USER_UPDATED: 'userUpdated',
};

export class SupabaseAuthRepository implements AuthRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw toAuthError(error);
    return data.session ? toSession(data.session) : null;
  }

  onAuthStateChange(listener: AuthStateListener): () => void {
    const { data } = this.client.auth.onAuthStateChange((event, session) => {
      const mapped = EVENT_MAP[event];
      if (!mapped) return;
      listener(mapped, session ? toSession(session) : null);
    });
    return () => data.subscription.unsubscribe();
  }

  async signOut(scope: SignOutScope): Promise<void> {
    const { error } = await this.client.auth.signOut({ scope });
    if (error && !isAuthSessionMissingError(error)) throw toAuthError(error);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    if (error) throw toAuthError(error);
  }

  async verifyOtp(input: VerifyOtpInput): Promise<Session> {
    const { data, error } = await this.client.auth.verifyOtp({
      email: input.email,
      token: input.code,
      type: input.purpose,
    });
    if (error) throw toAuthError(error);
    if (!data.session) {
      throw new AuthError('Verification returned no session', { reason: 'otp_invalid' });
    }
    return toSession(data.session);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ password: newPassword });
    if (error) throw toAuthError(error);
  }

  async resendVerification(email: string): Promise<void> {
    const { error } = await this.client.auth.resend({ type: 'signup', email });
    if (error) throw toAuthError(error);
  }
}