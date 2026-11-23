import { useMemo } from 'react';

import type { DownloadItem } from '../../domain/entities/DownloadItem';
import type { DownloadStatus } from '../../domain/entities/DownloadStatus';
import { useDownloads } from './useDownloads';

export type DownloadUiState = {
  item: DownloadItem | null;
  status: DownloadStatus | 'none';
  progress: number;
};

export function useDownloadState(titleId: string, episodeId: string | null = null): DownloadUiState {
  const { items } = useDownloads();

  return useMemo(() => {
    const item = items.find((entry) => entry.titleId === titleId && entry.episodeId === episodeId) ?? null;
    return { item, status: item?.status ?? 'none', progress: item?.progress ?? 0 };
  }, [items, titleId, episodeId]);
}