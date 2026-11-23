import type { TitleId } from '@/features/catalog';

import type { NewReview, Review, ReviewPatch } from '../entities/Review';

export interface ReviewRepository {
  listByTitle(titleId: TitleId): Promise<Review[]>;
  listByUser(userId: string): Promise<Review[]>;
  findMine(userId: string, titleId: TitleId): Promise<Review | null>;
  add(input: NewReview): Promise<Review>;
  update(reviewId: string, patch: ReviewPatch): Promise<Review>;
  remove(reviewId: string): Promise<void>;
}