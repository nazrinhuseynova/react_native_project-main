import { AppError } from '@/core/errors/AppError';
import { NotFoundError } from '@/core/errors/NotFoundError';

import type { AvatarStorage } from '../repositories/AvatarStorage';
import type { ProfileRepository } from '../repositories/ProfileRepository';

export class DeleteProfile {
  private readonly repository: ProfileRepository;
  private readonly avatars: AvatarStorage;

  constructor(repository: ProfileRepository, avatars: AvatarStorage) {
    this.repository = repository;
    this.avatars = avatars;
  }

  async execute(id: string): Promise<void> {
    const profiles = await this.repository.list();
    const target = profiles.find((profile) => profile.id === id);
    if (!target) throw new NotFoundError('Profile not found', { resource: 'profile' });

    if (profiles.length <= 1) {
      throw new AppError('Cannot delete the last profile', {
        code: 'PROFILE_LAST',
        userMessageKey: 'profiles.errors.lastProfile',
      });
    }

    await this.repository.remove(id);
    if (target.avatarKey) await this.avatars.remove(target.avatarKey).catch(() => undefined);
  }
}