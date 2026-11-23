import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import type { Title } from '../../domain/entities/Title';
import { catalogKeys } from '../catalogKeys';

const EMPTY: Title[] = [];

export function useSimilarTitles(id: string | null | undefined) {
  const { catalog } = useServices();
  const { i18n } = useTranslation();

  const query = useQuery({
    queryKey: catalogKeys.recommendations(id ?? 'none', i18n.language),
    queryFn: () => catalog.getRecommendations.execute(id as string),
    enabled: !!id,
  });

  return { titles: query.data ?? EMPTY, isLoading: query.isLoading, isError: query.isError };
}