import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';

import type { Profile } from '../domain/entities/Profile';
import type {
  PinRecord,
  ProfileRepository,
  ProfileWrite,
} from '../domain/repositories/ProfileRepository';
import { PROFILE_COLUMNS, toProfile, toRowPatch, type ProfileRow } from './mappers/profileMapper';

const TABLE = 'profiles';

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'PROFILE', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseProfileRepository implements ProfileRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async list(): Promise<Profile[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(PROFILE_COLUMNS)
      .order('created_at', { ascending: true });
    if (error) throw toError('Failed to load profiles', error);
    return ((data ?? []) as ProfileRow[]).map(toProfile);
  }

  async get(id: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(PROFILE_COLUMNS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw toError('Failed to load profile', error);
    return data ? toProfile(data as ProfileRow) : null;
  }

  async create(data: ProfileWrite): Promise<Profile> {
    const { data: row, error } = await this.client
      .from(TABLE)
      .insert(toRowPatch(data))
      .select(PROFILE_COLUMNS)
      .single();
    if (error) throw toError('Failed to create profile', error);
    return toProfile(row as ProfileRow);
  }

  async update(id: string, data: Partial<ProfileWrite>): Promise<Profile> {
    const { data: row, error } = await this.client
      .from(TABLE)
      .update(toRowPatch(data))
      .eq('id', id)
      .select(PROFILE_COLUMNS)
      .single();
    if (error) throw toError('Failed to update profile', error);
    return toProfile(row as ProfileRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('id', id);
    if (error) throw toError('Failed to delete profile', error);
  }

  async setPin(id: string, pin: PinRecord | null): Promise<void> {
    const { error } = await this.client
      .from(TABLE)
      .update({ pin_hash: pin?.hash ?? null, pin_salt: pin?.salt ?? null })
      .eq('id', id);
    if (error) throw toError('Failed to update PIN', error);
  }
}