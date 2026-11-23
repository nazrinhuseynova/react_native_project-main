import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import type { Title } from '../../domain/entities/Title';
import { catalogKeys } from '../catalogKeys';

const TITLE_STALE_TIME_MS = 60 * 60 * 1000;

type Combined = { titles: Title[]; isLoading: boolean };

function combine(results: { data?: { title: Title }; isLoading: boolean }[]): Combined {
  return {
    titles: results.flatMap((result) => (result.data ? [result.data.title] : [])),
    isLoading: results.some((result) => result.isLoading),
  };
}

export function useTitlesByIds(ids: readonly string[]): Combined {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  return useQueries({
    queries: ids.map((id) => ({
      queryKey: catalogKeys.details(id, i18n.language),
      queryFn: () => catalog.getTitleDetails.execute(id),
      staleTime: TITLE_STALE_TIME_MS,
    })),
    combine,
  });
}