import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { NotFoundError } from '@/core/errors/NotFoundError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import type { TitleId } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';
import { useToast } from '@/shared/ui/ToastProvider';

import { historyKeys } from '../historyKey';

export function useClearHistory() {
  const { history } = useServices();
  const { activeProfile } = useActiveProfile();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();
  const profileId = activeProfile?.id ?? null;

  const requireProfile = (): string => {
    if (!profileId) throw new NotFoundError('No active profile', { resource: 'profile' });
    return profileId;
  };

  const settle = () => queryClient.invalidateQueries({ queryKey: historyKeys.all });
  const fail = (error: unknown) => toast.error(t(toUserMessage(error)));

  const clearAll = useMutation({
    mutationFn: () => history.clear.execute(requireProfile()),
    onSuccess: () => toast.success(t('history.cleared')),
    onError: fail,
    onSettled: settle,
  });

  const removeOne = useMutation({
    mutationFn: (titleId: TitleId) => history.remove.execute(requireProfile(), titleId),
    onError: fail,
    onSettled: settle,
  });

  return {
    clearAll: clearAll.mutate,
    isClearing: clearAll.isPending,
    removeOne: removeOne.mutate,
  };
}