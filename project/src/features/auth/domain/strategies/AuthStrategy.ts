import { AuthError } from '@/core/errors/AuthError';
import type { RegistryItem } from '@/core/registry/Registry';

import type { Session } from '../entities/Session';

export type AuthStrategyKind = 'email_password' | 'google' | 'email_otp' | 'biometric';

export type SignInCredentials =
  | { kind: 'email_password'; email: string; password: string }
  | { kind: 'google' }
  | { kind: 'email_otp'; email: string; code: string }
  | { kind: 'biometric'; promptMessage?: string };

export type SignUpInput = {
  email: string;
  password: string;
};

export type SignUpResult = {
  session: Session | null;
  needsEmailConfirmation: boolean;
};

export interface AuthStrategy extends RegistryItem {
  readonly id: AuthStrategyKind;
  readonly kind: AuthStrategyKind;
  signIn(credentials: SignInCredentials): Promise<Session>;
  signUp?(input: SignUpInput): Promise<SignUpResult>;
}

export interface BiometricAuthStrategy extends AuthStrategy {
  isAvailable(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  enable(refreshToken: string, promptMessage?: string): Promise<void>;
  disable(): Promise<void>;
  syncRefreshToken(refreshToken: string): Promise<void>;
}

export interface AuthStrategyProvider {
  get(kind: AuthStrategyKind): AuthStrategy | undefined;
}

export function createCancelledError(): AuthError {
  return new AuthError('Authentication was cancelled', {
    reason: 'unauthorized',
    details: { cancelled: true },
  });
}

export function isCancelledError(error: unknown): boolean {
  return error instanceof AuthError && error.details?.cancelled === true;
}