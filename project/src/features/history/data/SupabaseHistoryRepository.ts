import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { TitleId } from '@/features/catalog';

import type { WatchProgress } from '../domain/entities/WatchProgress';
import type { HistoryRepository } from '../domain/repositories/HistoryRepository';

const TABLE = 'watch_progress';
const COLUMNS = 'title_id, episode_id, position_sec, duration_sec, completed_at, updated_at';
const LIST_LIMIT = 200;

type ProgressRow = {
  title_id: string;
  episode_id: string | null;
  position_sec: number;
  duration_sec: number;
  completed_at: string | null;
  updated_at: string;
};

function toProgress(row: ProgressRow): WatchProgress {
  return {
    titleId: row.title_id as TitleId,
    episodeId: row.episode_id,
    positionSec: row.position_sec,
    durationSec: row.duration_sec,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  };
}

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'HISTORY', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseHistoryRepository implements HistoryRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async list(profileId: string): Promise<WatchProgress[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false })
      .limit(LIST_LIMIT);
    if (error) throw toError('Failed to load history', error);
    return ((data ?? []) as ProgressRow[]).map(toProgress);
  }

  async find(profileId: string, titleId: TitleId): Promise<WatchProgress | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .eq('profile_id', profileId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (error) throw toError('Failed to load progress', error);
    return data ? toProgress(data as ProgressRow) : null;
  }

  async save(profileId: string, progress: WatchProgress): Promise<void> {
    // completed_at yalnız tamamlananda göndərilir: yenidən izləmə əvvəlki "izlənib" qeydini silmir.
    const { error } = await this.client.from(TABLE).upsert(
      {
        profile_id: profileId,
        title_id: progress.titleId,
        episode_id: progress.episodeId,
        position_sec: progress.positionSec,
        duration_sec: progress.durationSec,
        updated_at: progress.updatedAt,
        ...(progress.completedAt ? { completed_at: progress.completedAt } : {}),
      },
      { onConflict: 'profile_id,title_id' },
    );
    if (error) throw toError('Failed to save progress', error);
  }

  async remove(profileId: string, titleId: TitleId): Promise<void> {
    const { error } = await this.client
      .from(TABLE)
      .delete()
      .eq('profile_id', profileId)
      .eq('title_id', titleId);
    if (error) throw toError('Failed to remove from history', error);
  }

  async clear(profileId: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('profile_id', profileId);
    if (error) throw toError('Failed to clear history', error);
  }
}