import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useAuth } from '@/features/auth';

import { SupabaseSubscriptionRepository } from '../../data/SupabaseSubscriptionRepository';
import { isSubscriptionEntitled } from '../../domain/entities/Subscription';
import { subscriptionKeys, usePlans } from './usePlans';

export function useSubscription() {
  const { supabase } = useServices();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const repo = useMemo(() => new SupabaseSubscriptionRepository(supabase), [supabase]);
  const { plans, isLoading: plansLoading } = usePlans();

  const query = useQuery({
    queryKey: subscriptionKeys.current(userId),
    queryFn: () => repo.getByUser(userId as string),
    enabled: userId !== null,
  });

  const subscription = query.data ?? null;
  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === subscription?.planId) ?? plans[0] ?? null,
    [plans, subscription],
  );

  return {
    subscription,
    currentPlan,
    isEntitled: isSubscriptionEntitled(subscription),
    isLoading: query.isLoading || plansLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
