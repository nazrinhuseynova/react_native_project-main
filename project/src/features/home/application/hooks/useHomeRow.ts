import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useContentFilter } from '@/features/parental';

import { categoryKey } from '../../domain/CategoryFilter';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeEntry, HomeRow } from '../../domain/HomeRow';
import { homeKeys } from '../homeKeys';

const EMPTY: HomeEntry[] = [];

export function useHomeRow(row: HomeRow, context: HomeContext) {
  const { filter } = useContentFilter();

  const query = useQuery({
    queryKey: homeKeys.row(
      row.id,
      context.profile.id,
      context.language,
      categoryKey(context.category),
    ),
    queryFn: () => row.load(context),
  });

  const entries = useMemo(() => {
    if (!query.data) return EMPTY;
    const allowed = new Set(filter(query.data.entries.map((entry) => entry.title)).map((title) => title.id));
    return query.data.entries.filter((entry) => allowed.has(entry.title.id));
  }, [query.data, filter]);

  return {
    entries,
    titleParams: query.data?.titleParams,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}