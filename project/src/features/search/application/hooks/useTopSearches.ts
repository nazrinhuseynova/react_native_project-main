import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import type { Title } from '@/features/catalog';

import { searchKeys } from '../searchKeys';

const EMPTY: Title[] = [];
const TOP_LIMIT = 10;
const TOP_STALE_TIME_MS = 60 * 60 * 1000;

export function useTopSearches() {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: searchKeys.top(i18n.language),
    queryFn: async () => (await catalog.discover.trending('all', 'week')).items.slice(0, TOP_LIMIT),
    staleTime: TOP_STALE_TIME_MS,
  });

  return { titles: query.data ?? EMPTY, isLoading: query.isLoading };
}