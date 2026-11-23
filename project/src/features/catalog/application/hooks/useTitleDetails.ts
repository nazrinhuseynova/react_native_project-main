import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import { catalogKeys } from '../catalogKeys';

export function useTitleDetails(id: string | null | undefined) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: catalogKeys.details(id ?? 'none', i18n.language),
    queryFn: () => catalog.getTitleDetails.execute(id as string),
    enabled: !!id,
  });

  return {
    details: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}