import type { DeletionGracePolicy } from '../policies/DeletionGracePolicy';
import type { AccountRepository } from '../repositories/AccountRepository';

export type DeletionRequestResult = {
  requestedAt: string;
  deadline: Date;
};

export class RequestAccountDeletion {
  private readonly repository: AccountRepository;
  private readonly grace: DeletionGracePolicy;

  constructor(repository: AccountRepository, grace: DeletionGracePolicy) {
    this.repository = repository;
    this.grace = grace;
  }

  async execute(reason: string | null): Promise<DeletionRequestResult> {
    const status = await this.repository.getDeletionStatus();
    const requestedAt = status.pending
      ? status.requestedAt
      : await this.repository.markDeletion(reason);

    return { requestedAt, deadline: this.grace.deadline(requestedAt) };
  }
}