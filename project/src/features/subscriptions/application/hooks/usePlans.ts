import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';

import { SupabasePlanRepository } from '../../data/SupabasePlanRepository';
import { DEFAULT_PLANS } from '../../domain/entities/Plan';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: ['subscriptions', 'plans'] as const,
  current: (userId: string | null) => ['subscriptions', 'current', userId] as const,
};

export function usePlans() {
  const { supabase } = useServices();
  const repo = useMemo(() => new SupabasePlanRepository(supabase), [supabase]);

  const query = useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: () => repo.list(),
    staleTime: 60 * 60 * 1000,
  });

  return {
    plans: query.data ?? [...DEFAULT_PLANS],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
