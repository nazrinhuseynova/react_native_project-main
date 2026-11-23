import type { ParentalRepository } from '../repositories/ParentalRepository';

export class UnblockTitle {
  private readonly repository: ParentalRepository;

  constructor(repository: ParentalRepository) {
    this.repository = repository;
  }

  execute(profileId: string, titleId: string): Promise<void> {
    return this.repository.unblock(profileId, titleId);
  }
}