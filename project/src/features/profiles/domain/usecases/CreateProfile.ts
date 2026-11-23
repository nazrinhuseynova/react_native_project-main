import { AppError } from '@/core/errors/AppError';

import { effectiveMaturity } from '../entities/MaturityRating';
import { validateProfileName, type CreateProfileInput, type Profile } from '../entities/Profile';
import type { ProfileLimitPolicy } from '../policies/ProfileLimitPolicy';
import { resolveAvatar, type AvatarStorage } from '../repositories/AvatarStorage';
import type { ProfileRepository } from '../repositories/ProfileRepository';

export class CreateProfile {
  private readonly repository: ProfileRepository;
  private readonly limit: ProfileLimitPolicy;
  private readonly avatars: AvatarStorage;

  constructor(repository: ProfileRepository, limit: ProfileLimitPolicy, avatars: AvatarStorage) {
    this.repository = repository;
    this.limit = limit;
    this.avatars = avatars;
  }

  async execute(input: CreateProfileInput): Promise<Profile> {
    const existing = await this.repository.list();

    if (!this.limit.canCreate(existing.length)) {
      throw new AppError('Profile limit reached', {
        code: 'PROFILE_LIMIT',
        userMessageKey: 'profiles.errors.limit',
        details: { max: this.limit.max },
      });
    }

    const name = validateProfileName(
      input.name,
      existing.map((profile) => profile.name),
    );
    const avatar = await resolveAvatar(input.avatar, this.avatars);

    return this.repository.create({
      name,
      isKids: input.isKids,
      maturity: effectiveMaturity(input.isKids, input.maturity),
      ...avatar,
    });
  }
}