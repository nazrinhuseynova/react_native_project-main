import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { useServices } from '@/bootstrap/useServices';
import { AppError } from '@/core/errors/AppError';
import { useNetworkStatus } from '@/core/network/useNetworkStatus';
import { useActiveProfile } from '@/features/profiles';
import { useSettings } from '@/features/settings';

import type { DownloadItem } from '../domain/entities/DownloadItem';
import type { DownloadQuality } from '../domain/entities/DownloadQuality';
import type { DownloadEngineEvent } from '../domain/ports/DownloadEngine';
import type { EnqueueInput } from '../domain/usecases/EnqueueDownload';
import type { SmartContext } from '../domain/usecases/RunSmartDownloads';
import { registerDownloadsBackgroundTask } from './downloadsBackgroundTask';
import { registerSmartDownloadListener } from './listeners/smartDownloadListener';

export type EnqueueRequest = Omit<EnqueueInput, 'profileId' | 'quality'> & {
  quality?: DownloadQuality;
};

export type DownloadsContextValue = {
  items: DownloadItem[];
  isLoading: boolean;
  usedBytes: number;
  enqueue(request: EnqueueRequest): Promise<DownloadItem>;
  pause(id: string): Promise<void>;
  resume(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  refresh(): Promise<void>;
};

export const DownloadsContext = createContext<DownloadsContextValue | null>(null);

const PERSIST_INTERVAL_MS = 1000;

export function DownloadsProvider({ children }: PropsWithChildren) {
  const { downloads: service, eventBus, logger } = useServices();
  const { activeProfile } = useActiveProfile();
  const { settings } = useSettings();
  const network = useNetworkStatus();
  const profileId = activeProfile?.id ?? null;

  const [items, setItems] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsRef = useRef<DownloadItem[]>([]);
  itemsRef.current = items;
  const lastPersist = useRef(new Map<string, number>());
  const recoveredRef = useRef(false);

  const networkContext = useMemo(
    () => ({ connection: network.type, wifiOnly: settings.wifiOnlyDownloads }),
    [network.type, settings.wifiOnlyDownloads],
  );
  const networkRef = useRef(networkContext);
  networkRef.current = networkContext;

  const smartContext = useMemo<SmartContext | null>(
    () =>
      profileId
        ? {
            profileId,
            connection: network.type,
            wifiOnly: settings.wifiOnlyDownloads,
            quality: settings.downloadQuality,
            smartEnabled: settings.smartDownloads,
            limitGb: settings.downloadsForYouGb,
          }
        : null,
    [profileId, network.type, settings],
  );
  const smartRef = useRef(smartContext);
  smartRef.current = smartContext;

  const refresh = useCallback(async () => {
    if (!profileId) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    const list = await service.repository.list(profileId);
    setItems(list);
    setIsLoading(false);
  }, [service, profileId]);

  // İlk yükləmə + yarımçıq qalanları "paused" et (engine yaddaşı tətbiqlə birlikdə itib)
  useEffect(() => {
    let active = true;
    (async () => {
      if (profileId && !recoveredRef.current) {
        recoveredRef.current = true;
        const existing = await service.repository.list(profileId);
        await Promise.all(
          existing
            .filter((item) => item.status === 'downloading')
            .map((item) => service.repository.patch(item.id, { status: 'paused', updatedAt: Date.now() })),
        );
      }
      if (active) await refresh();
    })().catch((error: unknown) => logger.warn('downloads.load_failed', { error: String(error) }));
    return () => {
      active = false;
    };
  }, [service, profileId, refresh, logger]);

  // Engine hadisələri
  useEffect(() => {
    const handle = async (event: DownloadEngineEvent) => {
      const now = Date.now();

      if (event.type === 'progress') {
        const progress = event.bytesTotal > 0 ? event.bytesDownloaded / event.bytesTotal : 0;
        setItems((current) =>
          current.map((item) =>
            item.id === event.id
              ? {
                  ...item,
                  status: 'downloading',
                  progress,
                  bytesDownloaded: event.bytesDownloaded,
                  bytesTotal: event.bytesTotal,
                }
              : item,
          ),
        );
        const last = lastPersist.current.get(event.id) ?? 0;
        if (now - last >= PERSIST_INTERVAL_MS) {
          lastPersist.current.set(event.id, now);
          await service.repository.patch(event.id, {
            status: 'downloading',
            progress,
            bytesDownloaded: event.bytesDownloaded,
            bytesTotal: event.bytesTotal,
            updatedAt: now,
          });
        }
        return;
      }

      if (event.type === 'completed') {
        const item = itemsRef.current.find((entry) => entry.id === event.id) ?? (await service.repository.get(event.id));
        await service.repository.patch(event.id, {
          status: 'completed',
          progress: 1,
          fileUri: event.fileUri,
          bytesTotal: event.bytesTotal,
          bytesDownloaded: event.bytesTotal,
          expiresAt: service.licensePolicy.expiryFor(now),
          lastLicenseCheckAt: now,
          updatedAt: now,
        });
        if (item) eventBus.emit('download.completed', { downloadId: event.id, titleId: item.titleId });
      } else if (event.type === 'paused') {
        await service.repository.patch(event.id, { status: 'paused', updatedAt: now });
      } else {
        await service.repository.patch(event.id, { status: 'failed', updatedAt: now });
        logger.warn('downloads.failed', { id: event.id, message: event.message });
      }

      await refresh();
    };

    return service.engine.subscribe((event) => {
      handle(event).catch((error: unknown) => logger.warn('downloads.event_failed', { error: String(error) }));
    });
  }, [service, eventBus, logger, refresh]);

  // Smart Downloads: izlənən seriya bitəndə
  useEffect(
    () =>
      registerSmartDownloadListener(
        eventBus,
        async (event) => {
          const context = smartRef.current;
          if (!context) return;
          await service.smart.onPlaybackCompleted(event, context);
          await refresh();
        },
        logger,
      ),
    [eventBus, service, logger, refresh],
  );

  // Şəbəkə uyğunlaşanda gözləyənləri başlat + lisenziya yoxla
  useEffect(() => {
    if (!profileId || network.isOffline) return;
    service.smart
      .startPending({ profileId, connection: network.type, wifiOnly: settings.wifiOnlyDownloads })
      .then(refresh)
      .catch(() => undefined);
  }, [service, profileId, network.type, network.isOffline, settings.wifiOnlyDownloads, refresh]);

  useEffect(() => {
    service.licenses
      .execute({ isOnline: !network.isOffline })
      .then(refresh)
      .catch((error: unknown) => logger.warn('downloads.license_failed', { error: String(error) }));
  }, [service, network.isOffline, refresh, logger]);

  useEffect(() => {
    registerDownloadsBackgroundTask().catch(() => undefined);
  }, []);

  const requireProfile = useCallback((): string => {
    if (!profileId) {
      throw new AppError('No active profile', { code: 'NO_PROFILE', userMessageKey: 'errors.unknown' });
    }
    return profileId;
  }, [profileId]);

  const enqueue = useCallback(
    async (request: EnqueueRequest) => {
      const item = await service.enqueue.execute(
        {
          ...request,
          profileId: requireProfile(),
          quality: request.quality ?? settings.downloadQuality,
        },
        networkRef.current,
      );
      await refresh();
      return item;
    },
    [service, settings.downloadQuality, requireProfile, refresh],
  );

  const pause = useCallback(
    async (id: string) => {
      await service.pause.execute(id);
      await refresh();
    },
    [service, refresh],
  );

  const resume = useCallback(
    async (id: string) => {
      await service.resume.execute(id, networkRef.current);
      await refresh();
    },
    [service, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await service.remove.execute(id);
      await refresh();
    },
    [service, refresh],
  );

  const usedBytes = useMemo(
    () => items.reduce((sum, item) => sum + (item.status === 'completed' ? item.bytesTotal : item.bytesDownloaded), 0),
    [items],
  );

  const value = useMemo<DownloadsContextValue>(
    () => ({ items, isLoading, usedBytes, enqueue, pause, resume, remove, refresh }),
    [items, isLoading, usedBytes, enqueue, pause, resume, remove, refresh],
  );

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
}