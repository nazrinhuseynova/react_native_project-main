import type { TitleId } from '@/features/catalog';

import type { Review } from '../../domain/entities/Review';

export const REVIEW_COLUMNS = 'id, user_id, title_id, stars, body, author_name, created_at, updated_at';

export type ReviewRow = {
  id: string;
  user_id: string;
  title_id: string;
  stars: number;
  body: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};

export function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    userId: row.user_id,
    titleId: row.title_id as TitleId,
    stars: row.stars,
    text: row.body ?? '',
    authorName: row.author_name ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}