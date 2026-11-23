import { useEffect, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { readJson, writeJson } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';
import { useCountdown } from '@/shared/hooks/useCountdown';

import {
  INITIAL_LOGIN_ATTEMPTS,
  type LoginAttemptState,
} from '../../domain/policies/LoginAttemptPolicy';

export function useLoginLockout() {
  const { storage, auth } = useServices();
  const policy = auth.policies.loginAttempt;
  const countdown = useCountdown(0);
  const { start, reset } = countdown;
  const [state, setState] = useState<LoginAttemptState>(INITIAL_LOGIN_ATTEMPTS);

  useEffect(() => {
    let active = true;

    void readJson<LoginAttemptState>(storage, storageKeys.loginAttempts).then((stored) => {
      if (!active || !stored) return;
      const now = Date.now();
      const normalized = policy.normalize(stored, now);
      setState(normalized);
      const remaining = policy.remainingSeconds(normalized, now);
      if (remaining > 0) start(remaining);
    });

    return () => {
      active = false;
    };
  }, [storage, policy, start]);

  const registerFailure = async () => {
    const now = Date.now();
    const next = policy.recordFailure(state, now);
    setState(next);
    await writeJson(storage, storageKeys.loginAttempts, next);

    const remaining = policy.remainingSeconds(next, now);
    if (remaining > 0) start(remaining);
  };

  const registerSuccess = async () => {
    setState(policy.recordSuccess());
    reset();
    await storage.remove(storageKeys.loginAttempts);
  };

  return {
    isLocked: countdown.isRunning,
    remainingSeconds: countdown.remaining,
    registerFailure,
    registerSuccess,
  };
}