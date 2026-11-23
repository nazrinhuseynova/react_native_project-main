import { useEffect } from 'react';

import { screenCaptureGuard } from './ScreenCaptureGuard';

export function useSecureScreen(enabled = true, key = 'secure-screen'): void {
  useEffect(() => {
    if (!enabled) return undefined;

    screenCaptureGuard.enable(key).catch(() => undefined);

    return () => {
      screenCaptureGuard.disable(key).catch(() => undefined);
    };
  }, [enabled, key]);
}