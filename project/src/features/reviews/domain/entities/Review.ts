import type { TitleId } from '@/features/catalog';

export type Review = {
  id: string;
  userId: string;
  titleId: TitleId;
  stars: number;
  text: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type NewReview = {
  userId: string;
  titleId: TitleId;
  stars: number;
  text: string;
  authorName: string;
};

export type ReviewPatch = {
  stars: number;
  text: string;
};

export type StarDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export type ReviewSummary = {
  average: number;
  count: number;
  distribution: StarDistribution;
};

export function summarizeReviews(reviews: readonly Review[]): ReviewSummary {
  const distribution: StarDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;

  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.stars))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] += 1;
    total += review.stars;
  }

  const count = reviews.length;
  return { average: count > 0 ? Math.round((total / count) * 10) / 10 : 0, count, distribution };
}