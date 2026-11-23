import { AuthError } from '@/core/errors/AuthError';

import { normalizeEmail } from '../entities/AuthUser';
import type { PasswordPolicy } from '../policies/PasswordPolicy';
import type {
  AuthStrategyProvider,
  SignUpInput,
  SignUpResult,
} from '../strategies/AuthStrategy';

export class SignUp {
  private readonly strategies: AuthStrategyProvider;
  private readonly passwordPolicy: PasswordPolicy;

  constructor(strategies: AuthStrategyProvider, passwordPolicy: PasswordPolicy) {
    this.strategies = strategies;
    this.passwordPolicy = passwordPolicy;
  }

  async execute(input: SignUpInput): Promise<SignUpResult> {
    const validation = this.passwordPolicy.validate(input.password);
    if (!validation.valid) {
      throw new AuthError('Password does not meet the policy', {
        reason: 'weak_password',
        details: { issues: validation.issues },
      });
    }

    const strategy = this.strategies.get('email_password');
    if (!strategy?.signUp) {
      throw new AuthError('Email/password sign-up is not available', { reason: 'unknown' });
    }

    return strategy.signUp({ email: normalizeEmail(input.email), password: input.password });
  }
}