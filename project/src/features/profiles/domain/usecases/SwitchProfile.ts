import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import { NotFoundError } from '@/core/errors/NotFoundError';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import type { Profile } from '../entities/Profile';
import type { ProfileRepository } from '../repositories/ProfileRepository';

export class SwitchProfile {
  private readonly repository: ProfileRepository;
  private readonly storage: KeyValueStorage;
  private readonly events: EventBus<AppEvents>;

  constructor(
    repository: ProfileRepository,
    storage: KeyValueStorage,
    events: EventBus<AppEvents>,
  ) {
    this.repository = repository;
    this.storage = storage;
    this.events = events;
  }

  async execute(profileId: string): Promise<Profile> {
    const profile = await this.repository.get(profileId);
    if (!profile) throw new NotFoundError('Profile not found', { resource: 'profile' });

    await this.storage.setString(storageKeys.activeProfileId, profile.id);
    this.events.emit('profile.switched', { profileId: profile.id });
    return profile;
  }

  async clear(): Promise<void> {
    await this.storage.remove(storageKeys.activeProfileId);
  }
}