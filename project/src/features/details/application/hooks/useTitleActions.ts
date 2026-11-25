import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { toRouteParams, type Title } from '@/features/catalog';
import { useDownloadState, useDownloads } from '@/features/downloads';
import { useMyReview } from '@/features/reviews';
import { useToast } from '@/shared/ui/ToastProvider';

import { useShareTitle } from './useShareTitle';

export function useTitleActions(title: Title | undefined) {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const share = useShareTitle(title);
  const { review } = useMyReview(title?.id ?? null);
  const { enqueue, resume } = useDownloads();
  const downloadState = useDownloadState(title?.id ?? '', null);

  const play = useCallback(() => {
    if (!title) return;
    router.push({ pathname: '/player/[id]', params: toRouteParams(title.id) });
  }, [router, title]);

  const rate = useCallback(() => {
    if (!title) return;
    router.push({ pathname: '/movie/[id]/edit-review', params: toRouteParams(title.id) });
  }, [router, title]);

  const download = useCallback(() => {
    if (!title) return;
    const { status, item } = downloadState;

    if (status === 'completed' || status === 'queued' || status === 'downloading') {
      router.push('/downloads');
      return;
    }

    const action =
      status === 'paused' && item
        ? resume(item.id)
        : enqueue({
            titleId: title.id,
            episodeId: null,
            title: title.name,
            posterPath: title.poster?.medium ?? null,
          });

    action
      .then(() => toast.success(t('downloads.started', { title: title.name })))
      .catch((error: unknown) => toast.error(t(toUserMessage(error))));
  }, [router, title, downloadState, enqueue, resume, toast, t]);

  return {
    play,
    rate,
    download,
    share,
    myRating: review?.stars ?? null,
    downloadStatus: downloadState.status,
    downloadProgress: downloadState.progress,
  };
}