import type { HistoryRepository } from '../repositories/HistoryRepository';

export class ClearHistory {
  private readonly repository: HistoryRepository;

  constructor(repository: HistoryRepository) {
    this.repository = repository;
  }

  execute(profileId: string): Promise<void> {
    return this.repository.clear(profileId);
  }
}