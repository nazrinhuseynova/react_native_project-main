import type { SupabaseClient } from '@supabase/supabase-js';
import * as LocalAuthentication from 'expo-local-authentication';

import { AuthError } from '@/core/errors/AuthError';

import type { Session } from '../../domain/entities/Session';
import {
  createCancelledError,
  type BiometricAuthStrategy,
  type SignInCredentials,
} from '../../domain/strategies/AuthStrategy';
import type { BiometricCredentialStore } from '../BiometricCredentialStore';
import { toAuthError, toSession } from '../mappers/sessionMapper';

const DEFAULT_PROMPT = 'Confirm your identity';

export class BiometricStrategy implements BiometricAuthStrategy {
  readonly id = 'biometric' as const;
  readonly kind = 'biometric' as const;
  readonly order = 40;
  private readonly client: SupabaseClient;
  private readonly store: BiometricCredentialStore;

  constructor(client: SupabaseClient, store: BiometricCredentialStore) {
    this.client = client;
    this.store = store;
  }

  async isAvailable(): Promise<boolean> {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && isEnrolled;
  }

  isEnabled(): Promise<boolean> {
    return this.store.has();
  }

  async enable(refreshToken: string, promptMessage?: string): Promise<void> {
    await this.authenticate(promptMessage);
    await this.store.save(refreshToken);
  }

  disable(): Promise<void> {
    return this.store.clear();
  }

  /** Supabase refresh token-i hər yeniləmədə dəyişir, saxlanılan nüsxəni də yeniləyirik. */
  async syncRefreshToken(refreshToken: string): Promise<void> {
    if (await this.store.has()) await this.store.save(refreshToken);
  }

  async signIn(credentials: SignInCredentials): Promise<Session> {
    if (credentials.kind !== 'biometric') {
      throw new AuthError('Unsupported credentials', { reason: 'unknown' });
    }

    const refreshToken = await this.store.read();
    if (!refreshToken) {
      throw new AuthError('Biometric sign-in is not enabled', { reason: 'session_expired' });
    }

    await this.authenticate(credentials.promptMessage);

    const { data, error } = await this.client.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error || !data.session) {
      await this.store.clear();
      throw error ? toAuthError(error) : new AuthError('Session expired', { reason: 'session_expired' });
    }
    return toSession(data.session);
  }

  private async authenticate(promptMessage?: string): Promise<void> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage ?? DEFAULT_PROMPT,
    });
    if (!result.success) throw createCancelledError();
  }
}