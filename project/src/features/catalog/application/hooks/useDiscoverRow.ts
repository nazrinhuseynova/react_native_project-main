import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import type { Title } from '../../domain/entities/Title';
import { runDiscoverQuery, type DiscoverQuery } from '../../domain/repositories/DiscoverRepository';
import { catalogKeys } from '../catalogKeys';

const EMPTY: Title[] = [];

export function useDiscoverRow(query: DiscoverQuery, options: { enabled?: boolean } = {}) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const result = useInfiniteQuery({
    queryKey: catalogKeys.discover(query, i18n.language),
    queryFn: ({ pageParam }) => runDiscoverQuery(catalog.discover, query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
    enabled: options.enabled ?? true,
  });

  const pages = result.data?.pages;

  const titles = useMemo(() => {
    if (!pages) return EMPTY;
    const seen = new Set<string>();
    const unique: Title[] = [];
    for (const page of pages) {
      for (const title of page.items) {
        if (seen.has(title.id)) continue;
        seen.add(title.id);
        unique.push(title);
      }
    }
    return unique;
  }, [pages]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = result;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    titles,
    loadMore,
    hasMore: !!result.hasNextPage,
    isLoading: result.isLoading,
    isError: result.isError,
    isFetchingNextPage: result.isFetchingNextPage,
    refetch: result.refetch,
  };
}