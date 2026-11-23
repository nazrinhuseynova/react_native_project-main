import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useTitlesByIds } from '@/features/catalog';

import type { LibraryItem, LibraryTab } from '../../domain/entities/LibraryEntry';
import { useLibrary } from './useLibrary';

type LibraryQueryParams = {
  tab: LibraryTab;
  sorterId: string;
  filterId: string | null;
};

export function useLibraryQuery({ tab, sorterId, filterId }: LibraryQueryParams) {
  const { library } = useServices();
  const { entries, isLoading: entriesLoading, isError, refetch } = useLibrary();

  const active = useMemo(
    () => entries.filter((entry) => (tab === 'saved' ? entry.saved : entry.favorite)),
    [entries, tab],
  );
  const ids = useMemo(() => active.map((entry) => entry.titleId), [active]);
  const { titles, isLoading: titlesLoading } = useTitlesByIds(ids);

  const items = useMemo(() => {
    const byId = new Map(titles.map((title) => [title.id, title] as const));
    const joined: LibraryItem[] = active.flatMap((entry) => {
      const title = byId.get(entry.titleId);
      return title ? [{ entry, title }] : [];
    });
    const sorter = library.sorters.get(sorterId) ?? library.sorters.all()[0];
    const filter = filterId ? (library.filters.get(filterId) ?? null) : null;
    return library.query.execute(joined, { tab, sorter, filter });
  }, [titles, active, library, sorterId, filterId, tab]);

  return {
    items,
    total: active.length,
    isLoading: entriesLoading || (active.length > 0 && titlesLoading && items.length === 0),
    isError,
    refetch,
  };
}