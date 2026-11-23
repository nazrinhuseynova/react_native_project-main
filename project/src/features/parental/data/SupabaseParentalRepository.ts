import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { DEFAULT_MATURITY, parseMaturity, type MaturityRating } from '@/features/profiles';

import type { BlockedTitleInput, ParentalSettings } from '../domain/entities/ParentalSettings';
import type { ParentalRepository } from '../domain/repositories/ParentalRepository';

const SETTINGS_TABLE = 'parental_settings';
const BLOCKED_TABLE = 'blocked_titles';

type BlockedRow = {
  title_id: string;
  title: string;
  poster_url: string | null;
  created_at: string;
};

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'PARENTAL', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseParentalRepository implements ParentalRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async get(profileId: string): Promise<ParentalSettings> {
    const [settings, blocked] = await Promise.all([
      this.client
        .from(SETTINGS_TABLE)
        .select('max_maturity')
        .eq('profile_id', profileId)
        .maybeSingle(),
      this.client
        .from(BLOCKED_TABLE)
        .select('title_id,title,poster_url,created_at')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false }),
    ]);

    if (settings.error) throw toError('Failed to load parental settings', settings.error);
    if (blocked.error) throw toError('Failed to load blocked titles', blocked.error);

    const maxMaturity =
      parseMaturity((settings.data as { max_maturity: string } | null)?.max_maturity) ??
      DEFAULT_MATURITY;

    return {
      profileId,
      maxMaturity,
      blockedTitles: ((blocked.data ?? []) as BlockedRow[]).map((row) => ({
        titleId: row.title_id,
        title: row.title,
        posterUrl: row.poster_url,
        blockedAt: row.created_at,
      })),
    };
  }

  async setMaxMaturity(profileId: string, rating: MaturityRating): Promise<void> {
    const { error } = await this.client
      .from(SETTINGS_TABLE)
      .upsert(
        { profile_id: profileId, max_maturity: rating, updated_at: new Date().toISOString() },
        { onConflict: 'profile_id' },
      );
    if (error) throw toError('Failed to save maturity limit', error);
  }

  async block(profileId: string, title: BlockedTitleInput): Promise<void> {
    const { error } = await this.client.from(BLOCKED_TABLE).upsert(
      {
        profile_id: profileId,
        title_id: title.titleId,
        title: title.title,
        poster_url: title.posterUrl,
      },
      { onConflict: 'profile_id,title_id' },
    );
    if (error) throw toError('Failed to block title', error);
  }

  async unblock(profileId: string, titleId: string): Promise<void> {
    const { error } = await this.client
      .from(BLOCKED_TABLE)
      .delete()
      .eq('profile_id', profileId)
      .eq('title_id', titleId);
    if (error) throw toError('Failed to unblock title', error);
  }
}