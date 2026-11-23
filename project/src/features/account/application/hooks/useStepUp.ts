import { useCallback, useEffect, useRef, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';

import type { SensitiveAction } from '../../domain/policies/StepUpAuthPolicy';

export type StepUpSheetState = {
  visible: boolean;
  isVerifying: boolean;
  errorKey: string | null;
  onSubmit: (password: string) => void;
  onCancel: () => void;
};


export function useStepUp(action: SensitiveAction) {
  const { account } = useServices();
  const { user } = useAuth();

  const [visible, setVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const verifiedAtRef = useRef<number | null>(null);
  const resolverRef = useRef<((ok: boolean) => void) | null>(null);

  const settle = useCallback((ok: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setVisible(false);
    resolve?.(ok);
  }, []);

  const request = useCallback((): Promise<boolean> => {
    if (!user) return Promise.resolve(false);
    if (!account.policies.stepUp.requiresStepUp(action, user.provider, verifiedAtRef.current, Date.now())) {
      return Promise.resolve(true);
    }
    setErrorKey(null);
    setVisible(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, [account, action, user]);

  const onSubmit = useCallback(
    (password: string) => {
      if (!user) return;
      setIsVerifying(true);
      setErrorKey(null);
      account.repository
        .verifyPassword(user.email, password)
        .then(() => {
          verifiedAtRef.current = Date.now();
          settle(true);
        })
        .catch((error: unknown) => setErrorKey(toUserMessage(error)))
        .finally(() => setIsVerifying(false));
    },
    [account, user, settle],
  );

  const onCancel = useCallback(() => settle(false), [settle]);

  useEffect(
    () => () => {
      resolverRef.current?.(false);
    },
    [],
  );

  const sheet: StepUpSheetState = { visible, isVerifying, errorKey, onSubmit, onCancel };
  return { request, sheet };
}