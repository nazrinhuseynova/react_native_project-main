import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { toRouteParams, type Title } from '@/features/catalog';
import { useMyReview } from '@/features/reviews';

import { useShareTitle } from './useShareTitle';

export function useTitleActions(title: Title | undefined) {
  const router = useRouter();
  const share = useShareTitle(title);
  const { review } = useMyReview(title?.id ?? null);

  const play = useCallback(() => {
    if (!title) return;
    router.push({ pathname: '/player/[id]', params: toRouteParams(title.id) });
  }, [router, title]);

  const rate = useCallback(() => {
    if (!title) return;
    router.push({ pathname: '/movie/[id]/edit-review', params: toRouteParams(title.id) });
  }, [router, title]);

  
  const download = useCallback(() => {
    router.push('/downloads');
  }, [router]);

  return { play, rate, download, share, myRating: review?.stars ?? null };
}