import { useEffect } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useCountdown } from '@/shared/hooks/useCountdown';

export function useResendTimer(autoStart = true) {
  const { auth } = useServices();
  const cooldownSeconds = auth.policies.otp.resendCooldownSeconds;
  const countdown = useCountdown(cooldownSeconds, false);
  const { start } = countdown;

  useEffect(() => {
    if (autoStart) start(cooldownSeconds);
  }, [autoStart, cooldownSeconds, start]);

  return {
    secondsLeft: countdown.remaining,
    canResend: !countdown.isRunning,
    restart: () => start(cooldownSeconds),
  };
}