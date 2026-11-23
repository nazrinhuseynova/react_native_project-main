import { AppError } from '@/core/errors/AppError';

import type { DeletionGracePolicy } from '../policies/DeletionGracePolicy';
import type { AccountRepository } from '../repositories/AccountRepository';

export class RestoreAccount {
  private readonly repository: AccountRepository;
  private readonly grace: DeletionGracePolicy;

  constructor(repository: AccountRepository, grace: DeletionGracePolicy) {
    this.repository = repository;
    this.grace = grace;
  }

  async execute(): Promise<void> {
    const status = await this.repository.getDeletionStatus();
    if (!status.pending) return;

    if (!this.grace.canRestore(status.requestedAt)) {
      throw new AppError('Grace period is over', {
        code: 'ACCOUNT_GRACE_EXPIRED',
        userMessageKey: 'account.errors.graceExpired',
      });
    }
    await this.repository.restore();
  }
}