import { useCallback, useMemo, useState } from 'react';

import {
  countActiveFilters,
  DEFAULT_SEARCH_FILTER,
  type SearchFilter,
} from '../../domain/entities/SearchFilter';

export function useSearchFilters() {
  const [filter, setFilter] = useState<SearchFilter>(DEFAULT_SEARCH_FILTER);

  const reset = useCallback(() => setFilter(DEFAULT_SEARCH_FILTER), []);
  const activeCount = useMemo(() => countActiveFilters(filter), [filter]);

  return { filter, setFilter, reset, activeCount };
}