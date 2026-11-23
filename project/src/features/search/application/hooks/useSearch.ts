import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useDebounce } from '@/shared/hooks/useDebounce';

import type { SearchFilter } from '../../domain/entities/SearchFilter';
import { EMPTY_SEARCH_RESULTS } from '../../domain/entities/SearchResult';
import { isSearchable, normalizeQuery } from '../../domain/services/normalizeQuery';
import { searchKeys } from '../searchKeys';

const SEARCH_DEBOUNCE_MS = 350;
const SEARCH_STALE_TIME_MS = 2 * 60 * 1000;

export function useSearch(rawQuery: string, filter: SearchFilter) {
  const { search } = useServices();
  const { i18n } = useTranslation();

  const debounced = useDebounce(rawQuery, SEARCH_DEBOUNCE_MS);
  const query = useMemo(() => normalizeQuery(debounced), [debounced]);
  const isActive = isSearchable(query);

  const result = useQuery({
    queryKey: searchKeys.results(i18n.language, query.folded, filter),
    queryFn: () => search.orchestrator.search({ query, filter }),
    enabled: isActive,
    placeholderData: keepPreviousData,
    staleTime: SEARCH_STALE_TIME_MS,
  });

  const isTyping = rawQuery.trim() !== debounced.trim();

  return {
    query,
    isActive,
    results: isActive ? (result.data ?? EMPTY_SEARCH_RESULTS) : EMPTY_SEARCH_RESULTS,
    isLoading: isActive && result.isLoading,
    isFetching: isTyping || result.isFetching,
    isError: isActive && result.isError,
    refetch: result.refetch,
  };
}