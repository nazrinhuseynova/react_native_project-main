import { useQuery } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';

import { homeKeys } from '../homeKeys';

const EMPTY: number[] = [];


export function usePreferredGenreIds(): readonly number[] {
  const { onboarding } = useServices();

  const query = useQuery({
    queryKey: homeKeys.preferredGenres,
    queryFn: () => onboarding.repository.getGenres(),
    staleTime: Infinity,
  });

  return query.data ?? EMPTY;
}