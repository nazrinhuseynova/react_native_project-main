import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { TitleId } from '@/features/catalog';

import { isReaction, type Reaction } from '../domain/entities/Reaction';
import type { ReactionRepository } from '../domain/repositories/ReactionRepository';

const TABLE = 'title_reactions';

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'REACTIONS', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseReactionRepository implements ReactionRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async get(userId: string, titleId: TitleId): Promise<Reaction | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('reaction')
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (error) throw toError('Failed to load reaction', error);
    const value = (data as { reaction: string } | null)?.reaction;
    return isReaction(value) ? value : null;
  }

  async set(userId: string, titleId: TitleId, reaction: Reaction): Promise<void> {
    const { error } = await this.client
      .from(TABLE)
      .upsert({ user_id: userId, title_id: titleId, reaction }, { onConflict: 'user_id,title_id' });
    if (error) throw toError('Failed to save reaction', error);
  }

  async clear(userId: string, titleId: TitleId): Promise<void> {
    const { error } = await this.client
      .from(TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('title_id', titleId);
    if (error) throw toError('Failed to clear reaction', error);
  }
}