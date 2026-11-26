import type { WatchProgress } from '../entities/WatchProgress';
import type { HistoryRepository } from '../repositories/HistoryRepository';

export class GetWatched {
  private readonly repository: HistoryRepository;

  constructor(repository: HistoryRepository) {
    this.repository = repository;
  }

  async execute(profileId: string): Promise<WatchProgress[]> {
    const all = await this.repository.list(profileId);
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}
