import type { AccountRepository } from '../repositories/AccountRepository';

export class RequestAccountDeletion {
  private readonly repository: AccountRepository;

  constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  execute(reason: string | null): Promise<void> {
    return this.repository.deleteAccount(reason);
  }
}