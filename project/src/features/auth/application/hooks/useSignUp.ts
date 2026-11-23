import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { useServices } from '@/bootstrap/useServices';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';

import type { PasswordStrengthLevel } from '../../domain/policies/PasswordStrength';
import type { SignUpInput } from '../../domain/strategies/AuthStrategy';

export function useSignUp() {
  const { auth, analytics } = useServices();
  const router = useRouter();

  const signUp = useMutation({
    mutationFn: (input: SignUpInput) => auth.signUp.execute(input),
    onSuccess: (result, input) => {
      analytics.track('sign_up', { method: 'email_password' });
      // Session varsa route guard özü yönləndirir. Yoxdursa email təsdiqi lazımdır.
      if (result.needsEmailConfirmation) {
        router.replace({ pathname: '/verify-email', params: { email: input.email } });
      }
    },
    onError: (error, input) => {
      // «Bu email artıq var» halı: Login-ə yönləndir.
      if (error instanceof AuthError && error.reason === 'user_already_exists') {
        router.replace({ pathname: '/login', params: { email: input.email, existing: '1' } });
      }
    },
  });

  const verify = useMutation({
    mutationFn: (input: { email: string; code: string }) =>
      auth.verifyOtp.execute({ ...input, purpose: 'signup' }),
  });

  const resend = useMutation({
    mutationFn: (email: string) => auth.resendVerification.execute(email),
  });

  const getPasswordStrength = (password: string): PasswordStrengthLevel | null =>
    password.length === 0 ? null : auth.policies.strength.evaluate(password).level;

  return {
    signUp: signUp.mutate,
    isPending: signUp.isPending,
    errorKey: signUp.error ? toUserMessage(signUp.error) : null,

    verifyCode: verify.mutateAsync,
    isVerifying: verify.isPending,
    verifyErrorKey: verify.error ? toUserMessage(verify.error) : null,

    resendCode: resend.mutateAsync,
    isResending: resend.isPending,
    resendErrorKey: resend.error ? toUserMessage(resend.error) : null,

    getPasswordStrength,
  };
}