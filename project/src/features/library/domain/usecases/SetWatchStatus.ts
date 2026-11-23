import type { TitleId } from '@/features/catalog';

import { isRemovable, patchEntry, type LibraryEntry } from '../entities/LibraryEntry';
import type { WatchStatus } from '../entities/WatchStatus';
import type { LibraryRepository } from '../repositories/LibraryRepository';

export class SetWatchStatus {
  private readonly repository: LibraryRepository;

  constructor(repository: LibraryRepository) {
    this.repository = repository;
  }

  async execute(profileId: string, titleId: TitleId, status: WatchStatus): Promise<LibraryEntry> {
    const existing = await this.repository.find(profileId, titleId);
    const next = patchEntry(existing, titleId, { watchStatus: status });

    if (isRemovable(next)) {
      await this.repository.remove(profileId, titleId);
    } else {
      await this.repository.upsert(profileId, next);
    }
    return next;
  }
}