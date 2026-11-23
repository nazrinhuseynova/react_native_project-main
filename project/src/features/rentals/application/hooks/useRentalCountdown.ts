import { useEffect, useMemo, useState } from 'react';

import type { Rental } from '../../domain/entities/Rental';
import { RentalWindowPolicy } from '../../domain/policies/RentalWindowPolicy';

export function useRentalCountdown(rental: Rental | null) {
  const policy = useMemo(() => new RentalWindowPolicy(), []);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!rental) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [rental]);

  const evaluation = useMemo(() => {
    if (!rental) return null;
    return policy.evaluate(rental, now);
  }, [rental, policy, now]);

  const formattedRemaining = useMemo(() => {
    if (!evaluation || evaluation.remainingMs <= 0) return '00:00:00';
    const totalSeconds = Math.floor(evaluation.remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return days > 0 ? `${days}g ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
  }, [evaluation]);

  return {
    evaluation,
    remainingMs: evaluation?.remainingMs ?? 0,
    formattedRemaining,
    isExpired: evaluation?.status === 'expired',
  };
}