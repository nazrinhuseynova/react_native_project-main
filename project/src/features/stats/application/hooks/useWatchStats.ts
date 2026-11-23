import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useAuth } from '@/features/auth';
import { useGenres } from '@/features/catalog';
import { useWatchedTitles } from '@/features/history';
import { reviewKeys, type Review } from '@/features/reviews';

import { StatsCalculator } from '../../domain/services/StatsCalculator';

const calculator = new StatsCalculator();
const NO_REVIEWS: Review[] = [];

/** history + reviews + catalog janrlarını birləşdirir. */
export function useWatchStats() {
  const { reviews } = useServices();
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const watched = useWatchedTitles();
  const { names } = useGenres('all');

  const myReviews = useQuery({
    queryKey: reviewKeys.user(userId),
    queryFn: () => reviews.reviews.listByUser(userId as string),
    enabled: userId !== null,
  });

  const stats = useMemo(
    () =>
      calculator.calculate({
        watched: watched.items.map(({ progress, title }) => ({
          kind: title.kind,
          genreIds: title.genreIds,
          watchedSeconds: progress.durationSec,
        })),
        ratings: (myReviews.data ?? NO_REVIEWS).map((review) => review.stars),
        genreNames: names,
      }),
    [watched.items, myReviews.data, names],
  );

  return { stats, isLoading: watched.isLoading || myReviews.isLoading };
}