import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import { pickTrailer, type Video } from '../../domain/entities/Video';
import { catalogKeys } from '../catalogKeys';

const EMPTY: Video[] = [];

export function useTrailers(id: string | null | undefined, options: { enabled?: boolean } = {}) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: catalogKeys.trailers(id ?? 'none', i18n.language),
    queryFn: async () => {
      const parsed = id as string;
      return catalog.titles.videos(parsed as Parameters<typeof catalog.titles.videos>[0]);
    },
    enabled: !!id && (options.enabled ?? true),
  });

  const videos = query.data ?? EMPTY;
  const trailer = useMemo(() => pickTrailer(videos), [videos]);

  return { videos, trailer, isLoading: query.isLoading, isError: query.isError };
}