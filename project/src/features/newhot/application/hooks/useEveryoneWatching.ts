import { useMemo } from 'react';

import { useDiscoverRow, type Title } from '@/features/catalog';
import { useContentFilter } from '@/features/parental';

const TOP_COUNT = 10;
const EMPTY: Title[] = [];

export type EveryoneWatchingMode = 'everyone' | 'top10';


export function useEveryoneWatching(mode: EveryoneWatchingMode, enabled: boolean) {
  const { filter } = useContentFilter();

  const query = useDiscoverRow(
    { type: 'trending', kind: 'all', window: mode === 'top10' ? 'day' : 'week' },
    { enabled },
  );

  const titles = useMemo(() => {
    if (query.titles.length === 0) return EMPTY;
    const visible = filter(query.titles);
    return mode === 'top10' ? visible.slice(0, TOP_COUNT) : visible;
  }, [query.titles, filter, mode]);

  return {
    titles,
    loadMore: mode === 'top10' ? undefined : query.loadMore,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
  };
}