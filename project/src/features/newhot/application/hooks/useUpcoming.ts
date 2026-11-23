import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import type { Title } from '@/features/catalog';
import { useContentFilter } from '@/features/parental';

import { newHotKeys } from '../newHotKeys';

const EMPTY: Title[] = [];

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function useUpcoming(options: { enabled?: boolean } = {}) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();
  const { filter } = useContentFilter();

  const query = useInfiniteQuery({
    queryKey: newHotKeys.upcoming(i18n.language),
    initialPageParam: 1,
    enabled: options.enabled ?? true,
    queryFn: async ({ pageParam }) => {
      const [movies, shows] = await Promise.all([
        catalog.discover.upcoming('movie', pageParam),
        catalog.discover.upcoming('tv', pageParam),
      ]);
      return { titles: [...movies.items, ...shows.items], hasMore: movies.hasMore || shows.hasMore };
    },
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length + 1 : undefined),
  });

  const pages = query.data?.pages;

  const titles = useMemo(() => {
    if (!pages) return EMPTY;
    const today = todayIso();
    const seen = new Set<string>();
    const upcoming: Title[] = [];

    for (const page of pages) {
      for (const title of page.titles) {
        if (seen.has(title.id)) continue;
        if (!title.releaseDate || title.releaseDate <= today) continue;
        seen.add(title.id);
        upcoming.push(title);
      }
    }

    return filter(upcoming).sort((a, b) => (a.releaseDate ?? '').localeCompare(b.releaseDate ?? ''));
  }, [pages, filter]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    titles,
    loadMore,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
  };
}