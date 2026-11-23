import { AuthError } from '@/core/errors/AuthError';

import { normalizeEmail } from '../entities/AuthUser';
import type { Session } from '../entities/Session';
import type { OtpPolicy } from '../policies/OtpPolicy';
import type { AuthRepository, OtpPurpose } from '../repositories/AuthRepository';
import type { AuthStrategyProvider } from '../strategies/AuthStrategy';

export type VerifyOtpPurpose = OtpPurpose | 'login';

export type VerifyOtpCommand = {
  email: string;
  code: string;
  purpose: VerifyOtpPurpose;
};

export class VerifyOtp {
  private readonly repository: AuthRepository;
  private readonly strategies: AuthStrategyProvider;
  private readonly policy: OtpPolicy;

  constructor(
    repository: AuthRepository,
    strategies: AuthStrategyProvider,
    policy: OtpPolicy,
  ) {
    this.repository = repository;
    this.strategies = strategies;
    this.policy = policy;
  }

  async execute(command: VerifyOtpCommand): Promise<Session> {
    const code = command.code.trim();
    if (!this.policy.isWellFormed(code)) {
      throw new AuthError('The code is malformed', { reason: 'otp_invalid' });
    }

    const email = normalizeEmail(command.email);

    if (command.purpose === 'login') {
      const strategy = this.strategies.get('email_otp');
      if (!strategy) throw new AuthError('Email OTP is not available', { reason: 'unknown' });
      return strategy.signIn({ kind: 'email_otp', email, code });
    }

    return this.repository.verifyOtp({ email, code, purpose: command.purpose });
  }
}