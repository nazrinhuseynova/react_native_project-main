import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { TitleId } from '@/features/catalog';

import type { LibraryEntry } from '../domain/entities/LibraryEntry';
import { DEFAULT_WATCH_STATUS, isWatchStatus } from '../domain/entities/WatchStatus';
import type { LibraryRepository } from '../domain/repositories/LibraryRepository';

const TABLE = 'library_entries';
const COLUMNS = 'title_id, saved, favorite, watch_status, added_at';

type LibraryRow = {
  title_id: string;
  saved: boolean;
  favorite: boolean;
  watch_status: string;
  added_at: string;
};

function toEntry(row: LibraryRow): LibraryEntry {
  return {
    titleId: row.title_id as TitleId,
    saved: row.saved,
    favorite: row.favorite,
    watchStatus: isWatchStatus(row.watch_status) ? row.watch_status : DEFAULT_WATCH_STATUS,
    addedAt: row.added_at,
  };
}

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'LIBRARY', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseLibraryRepository implements LibraryRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async list(profileId: string): Promise<LibraryEntry[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .eq('profile_id', profileId)
      .order('added_at', { ascending: false });
    if (error) throw toError('Failed to load library', error);
    return ((data ?? []) as LibraryRow[]).map(toEntry);
  }

  async find(profileId: string, titleId: TitleId): Promise<LibraryEntry | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .eq('profile_id', profileId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (error) throw toError('Failed to load library entry', error);
    return data ? toEntry(data as LibraryRow) : null;
  }

  async upsert(profileId: string, entry: LibraryEntry): Promise<LibraryEntry> {
    const { data, error } = await this.client
      .from(TABLE)
      .upsert(
        {
          profile_id: profileId,
          title_id: entry.titleId,
          saved: entry.saved,
          favorite: entry.favorite,
          watch_status: entry.watchStatus,
          added_at: entry.addedAt,
        },
        { onConflict: 'profile_id,title_id' },
      )
      .select(COLUMNS)
      .single();
    if (error) throw toError('Failed to save library entry', error);
    return toEntry(data as LibraryRow);
  }

  async remove(profileId: string, titleId: TitleId): Promise<void> {
    const { error } = await this.client
      .from(TABLE)
      .delete()
      .eq('profile_id', profileId)
      .eq('title_id', titleId);
    if (error) throw toError('Failed to delete library entry', error);
  }
}