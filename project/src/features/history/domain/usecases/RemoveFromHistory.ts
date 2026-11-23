import type { TitleId } from '@/features/catalog';

import type { HistoryRepository } from '../repositories/HistoryRepository';

export class RemoveFromHistory {
  private readonly repository: HistoryRepository;

  constructor(repository: HistoryRepository) {
    this.repository = repository;
  }

  execute(profileId: string, titleId: TitleId): Promise<void> {
    return this.repository.remove(profileId, titleId);
  }
}