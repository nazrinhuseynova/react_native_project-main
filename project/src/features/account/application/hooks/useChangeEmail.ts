import { useMutation } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { ValidationError } from '@/core/errors/ValidationError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import { useStepUp } from './useStepUp';

export function useChangeEmail() {
  const { account } = useServices();
  const { user } = useAuth();
  const stepUp = useStepUp('change_email');

  const mutation = useMutation({
    mutationFn: async (newEmail: string): Promise<string | null> => {
      if (!user) return null;
      if (!(await stepUp.request())) return null;
      return account.changeEmail.execute(user.email, newEmail);
    },
  });

  const error = mutation.error;
  const errorKey =
    error instanceof ValidationError
      ? (Object.values(error.fields)[0] ?? toUserMessage(error))
      : error
        ? toUserMessage(error)
        : null;

  return {
    currentEmail: user?.email ?? '',
    changeEmail: mutation.mutateAsync,
    isPending: mutation.isPending,
    errorKey,
    reset: mutation.reset,
    sheet: stepUp.sheet,
  };
}