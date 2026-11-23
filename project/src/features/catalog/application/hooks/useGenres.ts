import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import type { Genre } from '../../domain/entities/Genre';
import type { MediaKind } from '../../domain/entities/TitleId';
import { catalogKeys } from '../catalogKeys';

const EMPTY: Genre[] = [];
const GENRES_STALE_TIME_MS = 24 * 60 * 60 * 1000;

export function useGenres(kind: MediaKind | 'all' = 'all') {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: catalogKeys.genres(kind, i18n.language),
    queryFn: () => (kind === 'all' ? catalog.genres.all() : catalog.genres.list(kind)),
    staleTime: GENRES_STALE_TIME_MS,
  });

  const genres = query.data ?? EMPTY;

  const names = useMemo(
    () => Object.fromEntries(genres.map((genre) => [genre.id, genre.name])) as Record<number, string>,
    [genres],
  );

  return { genres, names, isLoading: query.isLoading, isError: query.isError };
}