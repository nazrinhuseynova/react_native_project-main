import { NotFoundError } from '@/core/errors/NotFoundError';

import { effectiveMaturity } from '../entities/MaturityRating';
import { validateProfileName, type Profile, type ProfilePatch } from '../entities/Profile';
import { resolveAvatar, type AvatarStorage } from '../repositories/AvatarStorage';
import type { ProfileRepository, ProfileWrite } from '../repositories/ProfileRepository';

export class UpdateProfile {
  private readonly repository: ProfileRepository;
  private readonly avatars: AvatarStorage;

  constructor(repository: ProfileRepository, avatars: AvatarStorage) {
    this.repository = repository;
    this.avatars = avatars;
  }

  async execute(id: string, patch: ProfilePatch): Promise<Profile> {
    const profiles = await this.repository.list();
    const current = profiles.find((profile) => profile.id === id);
    if (!current) throw new NotFoundError('Profile not found', { resource: 'profile' });

    const data: Partial<ProfileWrite> = {};

    if (patch.name !== undefined) {
      data.name = validateProfileName(
        patch.name,
        profiles.filter((profile) => profile.id !== id).map((profile) => profile.name),
      );
    }

    if (patch.isKids !== undefined) data.isKids = patch.isKids;

    if (patch.isKids !== undefined || patch.maturity !== undefined) {
      data.maturity = effectiveMaturity(
        patch.isKids ?? current.isKids,
        patch.maturity ?? current.maturity,
      );
    }

    if (patch.avatar) Object.assign(data, await resolveAvatar(patch.avatar, this.avatars));

    const updated = await this.repository.update(id, data);

    if (patch.avatar && current.avatarKey && current.avatarKey !== updated.avatarKey) {
      await this.avatars.remove(current.avatarKey).catch(() => undefined);
    }
    return updated;
  }
}