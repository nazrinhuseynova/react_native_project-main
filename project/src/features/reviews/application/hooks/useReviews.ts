import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import type { TitleId } from '@/features/catalog';

import { summarizeReviews, type Review } from '../../domain/entities/Review';
import { reviewKeys } from '../reviewKeys';

const EMPTY: Review[] = [];

export function useReviews(titleId: TitleId | null) {
  const { reviews } = useServices();

  const query = useQuery({
    queryKey: reviewKeys.title(titleId),
    queryFn: () => reviews.reviews.listByTitle(titleId as TitleId),
    enabled: titleId !== null,
  });

  const list = query.data ?? EMPTY;
  const summary = useMemo(() => summarizeReviews(list), [list]);

  return {
    reviews: list,
    summary,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}