import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/bootstrap/useServices';
import { AppError } from '@/core/errors/AppError';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import {
  MockPaymentGateway,
  SupabaseInvoiceRepository,
  SupabasePaymentMethodRepository,
} from '@/features/payments';
import { useToast } from '@/shared/ui/ToastProvider';

import { SupabasePlanRepository } from '../../data/SupabasePlanRepository';
import { SupabaseSubscriptionRepository } from '../../data/SupabaseSubscriptionRepository';
import { ChangePlan, type ChangePlanOutcome } from '../../domain/usecases/ChangePlan';
import { subscriptionKeys } from './usePlans';

export type ChangePlanResult =
  | { ok: true; outcome: ChangePlanOutcome }
  | { ok: false; code: string };

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
        {
          gateway: new MockPaymentGateway(),
          methods: new SupabasePaymentMethodRepository(supabase),
          invoices: new SupabaseInvoiceRepository(supabase),
        },
      ),
    [supabase],
  );

  const mutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!userId) throw new AuthError('Not signed in', { reason: 'unauthorized' });
      return useCase.execute(userId, planId);
    },
    onSuccess: (outcome) => {
      if (outcome.kind === 'subscribed') {
        eventBus.emit('subscription.purchased', { planId: outcome.planId });
        analytics.track('subscription_purchased', {
          planId: outcome.planId,
          amountMinor: outcome.chargedMinor,
          currency: outcome.currency,
        });
        toast.success(t('subscription.changedToast'));
      } else if (outcome.kind === 'resumed') {
        toast.success(t('subscription.resumedToast'));
      } else if (outcome.kind === 'cancel_scheduled') {
        toast.success(t('subscription.canceledToast'));
      }

      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: ['invoices', userId] });
      }
    },
    onError: (error) => {
      toast.error(t(toUserMessage(error)));
    },
  });

 
  const changePlan = async (planId: string): Promise<ChangePlanResult> => {
    try {
      const outcome = await mutation.mutateAsync(planId);
      return { ok: true, outcome };
    } catch (error) {
      return { ok: false, code: error instanceof AppError ? error.code : 'UNKNOWN' };
    }
  };

  return {
    changePlan,
    isChanging: mutation.isPending,
  };
}