import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import { accountKeys } from '../accountKeys';
import { useStepUp } from './useStepUp';

export function useDeleteAccount() {
  const { account } = useServices();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  const stepUp = useStepUp('delete_account');

  const status = useQuery({
    queryKey: accountKeys.deletion,
    queryFn: () => account.repository.getDeletionStatus(),
  });

  const request = useMutation({
    mutationFn: async (reason: string | null): Promise<boolean> => {
      if (!(await stepUp.request())) return false;
      await account.requestDeletion.execute(reason);
      await signOut();
      return true;
    },
  });

  const restore = useMutation({
    mutationFn: () => account.restore.execute(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.deletion }),
  });

  const data = status.data;
  const pending = data?.pending === true;

  return {
    isLoading: status.isLoading,
    isPendingDeletion: pending,
    daysLeft: data?.pending ? account.policies.grace.daysLeft(data.requestedAt) : null,
    graceDays: account.policies.grace.graceDays,

    requestDeletion: request.mutateAsync,
    isRequesting: request.isPending,
    requestErrorKey: request.error ? toUserMessage(request.error) : null,

    restoreAccount: restore.mutateAsync,
    isRestoring: restore.isPending,
    restoreErrorKey: restore.error ? toUserMessage(restore.error) : null,

    sheet: stepUp.sheet,
  };
}