import { ValidationError } from '@/core/errors/ValidationError';

import type { MaturityRating } from './MaturityRating';

export const PROFILE_NAME_MAX = 20;

export type Profile = {
  id: string;
  name: string;
  isKids: boolean;
  maturity: MaturityRating;
  avatarPreset: string | null;
  avatarUrl: string | null;
  avatarKey: string | null;
  pinHash: string | null;
  pinSalt: string | null;
  createdAt: string;
};

export type AvatarInput =
  | { kind: 'preset'; presetId: string }
  | { kind: 'upload'; localUri: string };

export type CreateProfileInput = {
  name: string;
  isKids: boolean;
  maturity?: MaturityRating;
  avatar: AvatarInput;
};

export type ProfilePatch = Partial<CreateProfileInput>;

export function hasPin(profile: Pick<Profile, 'pinHash'>): boolean {
  return profile.pinHash !== null;
}

export function normalizeProfileName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function isValidProfileName(name: string): boolean {
  return name.length > 0 && name.length <= PROFILE_NAME_MAX;
}

export function validateProfileName(rawName: string, takenNames: readonly string[]): string {
  const name = normalizeProfileName(rawName);
  if (!isValidProfileName(name)) {
    throw new ValidationError('Invalid profile name', {
      fields: { name: 'profiles.validation.nameInvalid' },
    });
  }
  if (takenNames.some((taken) => taken.toLowerCase() === name.toLowerCase())) {
    throw new ValidationError('Profile name already used', {
      fields: { name: 'profiles.validation.nameTaken' },
    });
  }
  return name;
}