import { useMutation } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import { useStepUp } from './useStepUp';

export function useDeleteAccount() {
  const { account } = useServices();
  const { signOut } = useAuth();
  const stepUp = useStepUp('delete_account');

  const remove = useMutation({
    mutationFn: async (reason: string | null): Promise<boolean> => {
      if (!(await stepUp.request())) return false;
      await account.requestDeletion.execute(reason);
      try {
        await signOut();
      } catch {
       
      }
      return true;
    },
  });

  return {
    deleteAccount: remove.mutateAsync,
    isDeleting: remove.isPending,
    deleteErrorKey: remove.error ? toUserMessage(remove.error) : null,
    sheet: stepUp.sheet,
  };
}