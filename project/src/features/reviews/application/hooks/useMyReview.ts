import { useQuery } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { useAuth } from '@/features/auth';
import type { TitleId } from '@/features/catalog';

import { reviewKeys } from '../reviewKeys';

export function useMyReview(titleId: TitleId | null) {
  const { reviews } = useServices();
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const query = useQuery({
    queryKey: reviewKeys.mine(userId, titleId),
    queryFn: () => reviews.reviews.findMine(userId as string, titleId as TitleId),
    enabled: userId !== null && titleId !== null,
  });

  return { review: query.data ?? null, userId, isLoading: query.isLoading };
}