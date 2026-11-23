import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { AuthError } from '@/core/errors/AuthError';
import { toUserMessage } from '@/core/errors/toUserMessage';

import { isCancelledError } from '../../domain/strategies/AuthStrategy';
import { useAuth } from './useAuth';

export function useBiometricLogin() {
  const { t } = useTranslation();
  const { auth, analytics } = useServices();
  const { session, cancelRecovery } = useAuth();

  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const refresh = useCallback(async () => {
    const [available, enabled] = await Promise.all([
      auth.biometric.isAvailable(),
      auth.biometric.isEnabled(),
    ]);
    setIsAvailable(available);
    setIsEnabled(enabled);
  }, [auth]);

  useEffect(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  const signInMutation = useMutation({
    mutationFn: async () => {
      cancelRecovery();
      return auth.signIn.execute({
        kind: 'biometric',
        promptMessage: t('auth.biometric.prompt'),
      });
    },
    onSuccess: () => analytics.track('sign_in', { method: 'biometric' }),
    onError: () => {
      refresh().catch(() => undefined);
    },
  });

  const enableMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new AuthError('No active session', { reason: 'session_expired' });
      await auth.biometric.enable(session.refreshToken, t('auth.biometric.prompt'));
    },
    onSuccess: () => setIsEnabled(true),
  });

  const disable = async () => {
    await auth.biometric.disable();
    setIsEnabled(false);
  };

  const error = signInMutation.error ?? enableMutation.error;
  const visibleError = error && !isCancelledError(error) ? error : null;

  return {
    isAvailable,
    isEnabled,
    canUse: isAvailable && isEnabled,
    signIn: signInMutation.mutate,
    enable: enableMutation.mutateAsync,
    disable,
    isPending: signInMutation.isPending || enableMutation.isPending,
    errorKey: visibleError ? toUserMessage(visibleError) : null,
  };
}