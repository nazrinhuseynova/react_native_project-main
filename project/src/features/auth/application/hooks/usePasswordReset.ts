import { useMutation } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';

import type { PasswordStrengthLevel } from '../../domain/policies/PasswordStrength';
import { useAuth } from './useAuth';

export function usePasswordReset() {
  const { auth } = useServices();
  const { beginRecovery, cancelRecovery, completeRecovery, signOut } = useAuth();

  const request = useMutation({
    mutationFn: (email: string) => auth.requestPasswordReset.execute(email),
  });

  const verify = useMutation({
    mutationFn: async (input: { email: string; code: string }) => {
     beginRecovery();
      try {
        return await auth.verifyOtp.execute({ ...input, purpose: 'recovery' });
      } catch (error) {
        cancelRecovery();
        throw error;
      }
    },
  });

  const reset = useMutation({
    mutationFn: (newPassword: string) => auth.resetPassword.execute(newPassword),
    onSuccess: () => completeRecovery(),
  });

  const abandon = async () => {
    cancelRecovery();
    await signOut();
  };

  const getPasswordStrength = (password: string): PasswordStrengthLevel | null =>
    password.length === 0 ? null : auth.policies.strength.evaluate(password).level;

  return {
    requestCode: request.mutateAsync,
    isRequesting: request.isPending,
    requestErrorKey: request.error ? toUserMessage(request.error) : null,

    verifyCode: verify.mutateAsync,
    isVerifying: verify.isPending,
    verifyErrorKey: verify.error ? toUserMessage(verify.error) : null,

    resetPassword: reset.mutateAsync,
    isResetting: reset.isPending,
    resetErrorKey: reset.error ? toUserMessage(reset.error) : null,

    abandon,
    getPasswordStrength,
  };
}