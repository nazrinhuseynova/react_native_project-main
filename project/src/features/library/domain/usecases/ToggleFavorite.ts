import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import type { TitleId } from '@/features/catalog';

import { isRemovable, patchEntry, type LibraryEntry } from '../entities/LibraryEntry';
import type { LibraryRepository } from '../repositories/LibraryRepository';

export class ToggleFavorite {
  private readonly repository: LibraryRepository;
  private readonly events: EventBus<AppEvents>;

  constructor(repository: LibraryRepository, events: EventBus<AppEvents>) {
    this.repository = repository;
    this.events = events;
  }

  async execute(profileId: string, titleId: TitleId, favorite: boolean): Promise<LibraryEntry> {
    const existing = await this.repository.find(profileId, titleId);
    const next = patchEntry(existing, titleId, { favorite });

    if (isRemovable(next)) {
      await this.repository.remove(profileId, titleId);
    } else {
      await this.repository.upsert(profileId, next);
    }

    this.events.emit('title.favorited', { titleId, favorite });
    return next;
  }
}