import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useServices } from '@/bootstrap/useServices';

import { searchKeys } from '../searchKeys';

const EMPTY: string[] = [];

export function useRecentSearches() {
  const { search } = useServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: searchKeys.recent,
    queryFn: () => search.recent.list(),
    staleTime: Infinity,
  });

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: searchKeys.recent }),
    [queryClient],
  );

  const add = useCallback(
    async (text: string) => {
      await search.recent.add(text);
      await refresh();
    },
    [search, refresh],
  );

  const remove = useCallback(
    async (text: string) => {
      await search.recent.remove(text);
      await refresh();
    },
    [search, refresh],
  );

  const clear = useCallback(async () => {
    await search.recent.clear();
    await refresh();
  }, [search, refresh]);

  return { recent: query.data ?? EMPTY, add, remove, clear };
}