import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useServices } from '@/bootstrap/useServices';
import { useAuth } from '@/features/auth';
import { SupabaseSubscriptionRepository } from '../../data/SupabaseSubscriptionRepository';
import { getSubscriptionState, isSubscriptionEntitled } from '../../domain/entities/Subscription';
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
  const state = getSubscriptionState(subscription);

  const freePlan = useMemo(
    () => plans.find((plan) => plan.priceMinor === 0) ?? plans[0] ?? null,
    [plans],
  );
  const currentPlan = useMemo(() => {
    if (state === 'none' || state === 'expired') return freePlan;
    return plans.find((plan) => plan.id === subscription?.planId) ?? freePlan;
  }, [plans, subscription, state, freePlan]);

  const isPaid =
    state !== 'none' && state !== 'expired' && (currentPlan?.priceMinor ?? 0) > 0;

  return {
    subscription,
    state,
    currentPlan,
    isPaid,
    isCanceled: state === 'canceled',
    isEntitled: isSubscriptionEntitled(subscription),
    isLoading: query.isLoading || plansLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}