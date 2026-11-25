import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/ui/ToastProvider';

import { SupabasePlanRepository } from '../../data/SupabasePlanRepository';
import { SupabaseSubscriptionRepository } from '../../data/SupabaseSubscriptionRepository';
import { ChangePlan } from '../../domain/usecases/ChangePlan';
import { subscriptionKeys } from './usePlans';

export function useChangePlan() {
  const { supabase, eventBus, analytics } = useServices();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();
  const userId = user?.id ?? null;

  const useCase = useMemo(
    () =>
      new ChangePlan(
        new SupabasePlanRepository(supabase),
        new SupabaseSubscriptionRepository(supabase),
      ),
    [supabase],
  );

  const mutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!userId) throw new AuthError('Not signed in', { reason: 'unauthorized' });
      return useCase.execute(userId, planId);
    },
    onSuccess: (sub) => {
      eventBus.emit('subscription.purchased', { planId: sub.planId });
      analytics.track('subscription_purchased', { planId: sub.planId });
      toast.success(t('subscription.changedToast'));
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: (error) => {
      toast.error(t(toUserMessage(error)));
    },
  });

  return {
    changePlan: mutation.mutateAsync,
    isChanging: mutation.isPending,
  };
}
