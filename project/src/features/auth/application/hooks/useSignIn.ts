import { useMutation } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';

import { isCancelledError, type SignInCredentials } from '../../domain/strategies/AuthStrategy';
import { useAuth } from './useAuth';
import { useLoginLockout } from './useLoginLockout';

export function useSignIn() {
  const { auth, analytics } = useServices();
  const { cancelRecovery } = useAuth();
  const lockout = useLoginLockout();

  const mutation = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      if (credentials.kind === 'email_password' && lockout.isLocked) {
        throw new AuthError('Sign-in is temporarily locked', { reason: 'too_many_attempts' });
      }
      cancelRecovery();
      return auth.signIn.execute(credentials);
    },
    onSuccess: async (_session, credentials) => {
      analytics.track('sign_in', { method: credentials.kind });
      await lockout.registerSuccess();
    },
    onError: async (error, credentials) => {
      const isWrongPassword =
        credentials.kind === 'email_password' &&
        error instanceof AuthError &&
        error.reason === 'invalid_credentials';
      if (isWrongPassword) await lockout.registerFailure();
    },
  });

  const error = mutation.error && !isCancelledError(mutation.error) ? mutation.error : null;

  return {
    signIn: mutation.mutate,
    isPending: mutation.isPending,
    errorKey: error ? toUserMessage(error) : null,
    reset: mutation.reset,
    lockout,
  };
}