import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { TitleId } from '@/features/catalog';

import type { NewReview, Review, ReviewPatch } from '../domain/entities/Review';
import type { ReviewRepository } from '../domain/repositories/ReviewRepository';
import { REVIEW_COLUMNS, toReview, type ReviewRow } from './mappers/reviewMapper';

const TABLE = 'reviews';
const LIST_LIMIT = 100;

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'REVIEWS', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseReviewRepository implements ReviewRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async listByTitle(titleId: TitleId): Promise<Review[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(REVIEW_COLUMNS)
      .eq('title_id', titleId)
      .order('created_at', { ascending: false })
      .limit(LIST_LIMIT);
    if (error) throw toError('Failed to load reviews', error);
    return ((data ?? []) as ReviewRow[]).map(toReview);
  }

  async listByUser(userId: string): Promise<Review[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(REVIEW_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw toError('Failed to load user reviews', error);
    return ((data ?? []) as ReviewRow[]).map(toReview);
  }

  async findMine(userId: string, titleId: TitleId): Promise<Review | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(REVIEW_COLUMNS)
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .maybeSingle();
    if (error) throw toError('Failed to load review', error);
    return data ? toReview(data as ReviewRow) : null;
  }


  async add(input: NewReview): Promise<Review> {
    const { data, error } = await this.client
      .from(TABLE)
      .insert({
        user_id: input.userId,
        title_id: input.titleId,
        stars: input.stars,
        body: input.text,
        author_name: input.authorName,
      })
      .select(REVIEW_COLUMNS)
      .single();
    if (error) throw toError('Failed to add review', error);
    return toReview(data as ReviewRow);
  }


  async update(reviewId: string, patch: ReviewPatch): Promise<Review> {
    const { data, error } = await this.client
      .from(TABLE)
      .update({ stars: patch.stars, body: patch.text, updated_at: new Date().toISOString() })
      .eq('id', reviewId)
      .select(REVIEW_COLUMNS)
      .single();
    if (error) throw toError('Failed to update review', error);
    return toReview(data as ReviewRow);
  }


  async remove(reviewId: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('id', reviewId);
    if (error) throw toError('Failed to delete review', error);
  }
}