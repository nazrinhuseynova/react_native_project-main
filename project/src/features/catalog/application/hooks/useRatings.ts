import { useQueries } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';

import type { Rating, RatingQuery } from '../../domain/repositories/RatingSource';
import { catalogKeys } from '../catalogKeys';

const RATING_STALE_TIME_MS = 6 * 60 * 60 * 1000;

export function useRatings(title: RatingQuery | null | undefined) {
  const { catalog } = useServices();

  return useQueries({
    queries: catalog.ratingSources.map((source) => ({
      queryKey: catalogKeys.rating(title?.id ?? 'none', source.id),
      queryFn: () => source.get(title as RatingQuery),
      enabled: !!title,
      staleTime: RATING_STALE_TIME_MS,
    })),
    combine: (results) => ({
      ratings: results
        .map((result) => result.data)
        .filter((rating): rating is Rating => !!rating),
      isLoading: results.some((result) => result.isLoading),
    }),
  });
}