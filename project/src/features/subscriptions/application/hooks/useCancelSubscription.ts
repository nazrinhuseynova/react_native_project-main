import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/ui/ToastProvider';

import { SupabaseSubscriptionRepository } from '../../data/SupabaseSubscriptionRepository';
import { CancelSubscription } from '../../domain/usecases/CancelSubscription';
import { ResumeSubscription } from '../../domain/usecases/ResumeSubscription';
import { subscriptionKeys } from './usePlans';

export function useCancelSubscription() {
  const { supabase } = useServices();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();
  const userId = user?.id ?? null;

  const { cancelUseCase, resumeUseCase } = useMemo(() => {
    const repo = new SupabaseSubscriptionRepository(supabase);
    return {
      cancelUseCase: new CancelSubscription(repo),
      resumeUseCase: new ResumeSubscription(repo),
    };
  }, [supabase]);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new AuthError('Not signed in', { reason: 'unauthorized' });
      return cancelUseCase.execute(userId);
    },
    onSuccess: () => {
      toast.success(t('subscription.canceledToast'));
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: (error) => toast.error(t(toUserMessage(error))),
  });

  const resumeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new AuthError('Not signed in', { reason: 'unauthorized' });
      return resumeUseCase.execute(userId);
    },
    onSuccess: () => {
      toast.success(t('subscription.resumedToast'));
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
    },
    onError: (error) => toast.error(t(toUserMessage(error))),
  });

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      await cancelMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  };

  const resumeSubscription = async (): Promise<boolean> => {
    try {
      await resumeMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  };

  return {
    cancelSubscription,
    isCanceling: cancelMutation.isPending,
    resumeSubscription,
    isResuming: resumeMutation.isPending,
  };
}