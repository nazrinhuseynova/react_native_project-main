import { useEffect, useRef, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useCountdown } from '@/shared/hooks/useCountdown';

import { useActiveProfile } from './useActiveProfile';

export function usePinGate(profileId: string) {
  const { profiles: service } = useServices();
  const { switchProfile } = useActiveProfile();
  const lock = useCountdown(0);
  const { start: startLock } = lock;

  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    let active = true;
    service.verifyPin
      .lockState(profileId)
      .then((state) => {
        if (active && state.locked) startLock(state.remainingSeconds);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [service, profileId, startLock]);


  const verify = async (pin: string): Promise<boolean> => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setIsVerifying(true);
    try {
      const result = await service.verifyPin.execute(profileId, pin);

      if (result.status === 'ok') {
        await switchProfile(profileId);
        return true;
      }
      if (result.status === 'locked') {
        setHasError(false);
        startLock(result.remainingSeconds);
        return false;
      }
      setAttemptsLeft(result.attemptsLeft);
      setHasError(true);
      return false;
    } finally {
      busyRef.current = false;
      setIsVerifying(false);
    }
  };

  return {
    verify,
    isVerifying,
    hasError,
    attemptsLeft,
    isLocked: lock.isRunning,
    lockRemainingSeconds: lock.remaining,
  };
}