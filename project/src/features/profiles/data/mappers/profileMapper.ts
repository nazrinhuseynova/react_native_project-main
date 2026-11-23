import { DEFAULT_MATURITY, parseMaturity } from '../../domain/entities/MaturityRating';
import type { Profile } from '../../domain/entities/Profile';
import type { ProfileWrite } from '../../domain/repositories/ProfileRepository';

export type ProfileRow = {
  id: string;
  name: string;
  avatar_preset: string | null;
  avatar_url: string | null;
  avatar_key: string | null;
  is_kids: boolean;
  maturity: string;
  pin_hash: string | null;
  pin_salt: string | null;
  created_at: string;
};

export const PROFILE_COLUMNS =
  'id,name,avatar_preset,avatar_url,avatar_key,is_kids,maturity,pin_hash,pin_salt,created_at';

export function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.name,
    isKids: row.is_kids,
    maturity: parseMaturity(row.maturity) ?? DEFAULT_MATURITY,
    avatarPreset: row.avatar_preset,
    avatarUrl: row.avatar_url,
    avatarKey: row.avatar_key,
    pinHash: row.pin_hash,
    pinSalt: row.pin_salt,
    createdAt: row.created_at,
  };
}

export function toRowPatch(data: Partial<ProfileWrite>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.isKids !== undefined) row.is_kids = data.isKids;
  if (data.maturity !== undefined) row.maturity = data.maturity;
  if (data.avatarPreset !== undefined) row.avatar_preset = data.avatarPreset;
  if (data.avatarUrl !== undefined) row.avatar_url = data.avatarUrl;
  if (data.avatarKey !== undefined) row.avatar_key = data.avatarKey;
  return row;
}