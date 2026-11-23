import type { WatchProgress } from '../entities/WatchProgress';
import type { HistoryRepository } from '../repositories/HistoryRepository';
import type { ContinueWatchingSelector } from '../services/ContinueWatchingSelector';

export class GetContinueWatching {
  private readonly repository: HistoryRepository;
  private readonly selector: ContinueWatchingSelector;

  constructor(repository: HistoryRepository, selector: ContinueWatchingSelector) {
    this.repository = repository;
    this.selector = selector;
  }

  async execute(profileId: string): Promise<WatchProgress[]> {
    return this.selector.select(await this.repository.list(profileId));
  }
}