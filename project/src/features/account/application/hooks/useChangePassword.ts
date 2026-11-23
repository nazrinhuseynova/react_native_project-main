import { useMutation } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';

import { useStepUp } from './useStepUp';

export function useChangePassword() {
  const { account } = useServices();
  const stepUp = useStepUp('change_password');

  const mutation = useMutation({
    mutationFn: async (newPassword: string): Promise<boolean> => {
      if (!(await stepUp.request())) return false;
      await account.changePassword.execute(newPassword);
      return true;
    },
  });

  return {
    changePassword: mutation.mutateAsync,
    isPending: mutation.isPending,
    errorKey: mutation.error ? toUserMessage(mutation.error) : null,
    reset: mutation.reset,
    sheet: stepUp.sheet,
  };
}