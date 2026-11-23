import { AuthError } from '@/core/errors/AuthError';

import type { Session } from '../entities/Session';
import type { AuthStrategyProvider, SignInCredentials } from '../strategies/AuthStrategy';

export class SignIn {
  private readonly strategies: AuthStrategyProvider;

  constructor(strategies: AuthStrategyProvider) {
    this.strategies = strategies;
  }

  async execute(credentials: SignInCredentials): Promise<Session> {
    const strategy = this.strategies.get(credentials.kind);
    if (!strategy) {
      throw new AuthError(`Unknown auth strategy: ${credentials.kind}`, { reason: 'unknown' });
    }
    return strategy.signIn(credentials);
  }
}