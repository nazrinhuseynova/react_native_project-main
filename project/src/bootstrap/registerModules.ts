import * as Linking from 'expo-linking';

import { deepLinkRoutes } from '@/core/linking/deepLinkRoutes';
import { NotificationTapHandler } from '@/core/notifications/NotificationTapHandler';
import { setDownloadsTaskRunner } from '@/features/downloads';
import { startHistoryListener } from '@/features/history';

import type { Services } from './container';

const registered = new WeakSet<Services>();

export function registerModules(services: Services): void {
  if (registered.has(services)) return;
  registered.add(services);

  services.deepLinks.registerAll(deepLinkRoutes);

  new NotificationTapHandler((url) => {
    void Linking.openURL(url);
  }).start();

  // playback.progress → tarixçəyə yazılır (throttle ilə).
  startHistoryListener({
    events: services.eventBus,
    storage: services.storage,
    save: services.history.save,
    logger: services.logger,
  });

  // Arxa fon tapşırığı: yükləmə lisenziyalarını yoxlayır.
  setDownloadsTaskRunner(async () => {
    await services.downloads.licenses.execute({ isOnline: true });
  });
}