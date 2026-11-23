import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useServices } from '@/bootstrap/useServices';

import { onboardingKeys } from '../onboardingKeys';


export function useOnboardingStatus() {
  const { onboarding } = useServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: onboardingKeys.seen,
    queryFn: () => onboarding.repository.hasSeen(),
    staleTime: 0,
    gcTime: Infinity,
    meta: { persist: false },
  });

  const complete = useCallback(async () => {
    await onboarding.repository.markSeen();
    await queryClient.cancelQueries({ queryKey: onboardingKeys.seen });
    queryClient.setQueryData(onboardingKeys.seen, true);
  }, [onboarding, queryClient]);

  return {
    isReady: !query.isPending,
    hasSeenOnboarding: query.data ?? false,
    complete,
  };
}