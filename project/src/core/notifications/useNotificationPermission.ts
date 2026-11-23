import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import type { NotificationPermission, NotificationScheduler } from './NotificationScheduler';

export function useNotificationPermission(scheduler: NotificationScheduler) {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  const refresh = useCallback(async () => {
    setPermission(await scheduler.getPermission());
  }, [scheduler]);

  const request = useCallback(async () => {
    const next = await scheduler.requestPermission();
    setPermission(next);
    return next;
  }, [scheduler]);

  const openSettings = useCallback(() => Linking.openSettings(), []);

  useEffect(() => {
    void refresh();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  return {
    permission,
    isLoading: permission === null,
    isGranted: permission?.status === 'granted',
    isDenied: permission?.status === 'denied',
    canAskAgain: permission?.canAskAgain ?? true,
    request,
    refresh,
    openSettings,
  };
}