import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import { catalogKeys } from '../catalogKeys';

export function useSeason(id: string | null | undefined, seasonNumber: number | null) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: catalogKeys.season(id ?? 'none', seasonNumber ?? -1, i18n.language),
    queryFn: () => catalog.getSeason.execute(id as string, seasonNumber as number),
    enabled: !!id && seasonNumber !== null,
  });

  return {
    season: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}