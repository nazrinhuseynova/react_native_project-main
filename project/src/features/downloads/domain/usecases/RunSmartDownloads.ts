import type { ConnectionType } from '@/core/network/NetworkMonitor';

import { downloadKey } from '../entities/DownloadItem';
import type { DownloadQuality } from '../entities/DownloadQuality';
import type { DownloadEngine } from '../ports/DownloadEngine';
import type { DownloadsForYouPolicy, ForYouCandidate } from '../policies/DownloadsForYouPolicy';
import type { SmartDownloadPolicy } from '../policies/SmartDownloadPolicy';
import type { WifiOnlyPolicy } from '../policies/WifiOnlyPolicy';
import type { DownloadRepository } from '../repositories/DownloadRepository';
import type { DeleteDownload } from './DeleteDownload';
import type { EnqueueDownload } from './EnqueueDownload';

export type SmartContext = {
  profileId: string;
  connection: ConnectionType;
  wifiOnly: boolean;
  quality: DownloadQuality;
  smartEnabled: boolean;
  limitGb: number;
};

export type NextEpisodeInfo = { episodeId: string; title: string; posterPath: string | null };

/** catalog-dan gələn məlumat; downloads player-i tanımır (container birləşdirir). */
export type NextEpisodeLookup = (titleId: string, episodeId: string) => Promise<NextEpisodeInfo | null>;

export type ForYouProvider = (profileId: string) => Promise<ForYouCandidate[]>;

export class RunSmartDownloads {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;
  private readonly smart: SmartDownloadPolicy;
  private readonly forYou: DownloadsForYouPolicy;
  private readonly wifi: WifiOnlyPolicy;
  private readonly enqueue: EnqueueDownload;
  private readonly remove: DeleteDownload;
  private readonly nextEpisode: NextEpisodeLookup;
  private readonly forYouProvider: ForYouProvider;

  constructor(deps: {
    repository: DownloadRepository;
    engine: DownloadEngine;
    smart: SmartDownloadPolicy;
    forYou: DownloadsForYouPolicy;
    wifi: WifiOnlyPolicy;
    enqueue: EnqueueDownload;
    remove: DeleteDownload;
    nextEpisode: NextEpisodeLookup;
    forYouProvider: ForYouProvider;
  }) {
    this.repository = deps.repository;
    this.engine = deps.engine;
    this.smart = deps.smart;
    this.forYou = deps.forYou;
    this.wifi = deps.wifi;
    this.enqueue = deps.enqueue;
    this.remove = deps.remove;
    this.nextEpisode = deps.nextEpisode;
    this.forYouProvider = deps.forYouProvider;
  }

  /** playback.completed → izlənən yükləməni sil, növbəti seriyanı növbəyə qoy. */
  async onPlaybackCompleted(
    event: { titleId: string; episodeId?: string },
    context: SmartContext,
  ): Promise<void> {
    if (!context.smartEnabled || !event.episodeId) return;

    const watched = await this.repository.find(context.profileId, event.titleId, event.episodeId);
    const next = watched ? await this.nextEpisode(event.titleId, event.episodeId) : null;
    const decision = this.smart.decide(watched, next?.episodeId ?? null, context.smartEnabled);

    if (decision.deleteId) await this.remove.execute(decision.deleteId);

    if (decision.nextEpisodeId && next) {
      await this.enqueue.execute(
        {
          profileId: context.profileId,
          titleId: event.titleId,
          episodeId: next.episodeId,
          title: next.title,
          posterPath: next.posterPath,
          quality: context.quality,
        },
        { connection: context.connection, wifiOnly: context.wifiOnly, deferIfBlocked: true },
      );
    }
  }

  /** Şəbəkə uyğun olanda növbədə gözləyən yükləmələri başlat. */
  async startPending(context: Pick<SmartContext, 'profileId' | 'connection' | 'wifiOnly'>): Promise<number> {
    if (!this.wifi.canDownload(context.connection, context.wifiOnly)) return 0;
    const items = await this.repository.list(context.profileId);
    const queued = items.filter((item) => item.status === 'queued');
    for (const item of queued) await this.engine.start(item);
    return queued.length;
  }

  /** Downloads for You: yalnız Wi-Fi + GB limiti daxilində. */
  async fillForYou(context: SmartContext): Promise<number> {
    if (!context.smartEnabled || context.limitGb <= 0 || context.connection !== 'wifi') return 0;

    const items = await this.repository.list(context.profileId);
    const usedBytes = items.reduce((sum, item) => sum + (item.bytesTotal || 0), 0);
    const existing = new Set(items.map((item) => downloadKey(item.titleId, item.episodeId)));
    const candidates = await this.forYouProvider(context.profileId);
    const picked = this.forYou.select(candidates, usedBytes, context.limitGb, existing);

    for (const candidate of picked) {
      await this.enqueue.execute(
        {
          profileId: context.profileId,
          titleId: candidate.titleId,
          episodeId: candidate.episodeId,
          title: candidate.title,
          posterPath: candidate.posterPath,
          quality: context.quality,
        },
        { connection: context.connection, wifiOnly: context.wifiOnly, deferIfBlocked: true },
      );
    }
    return picked.length;
  }
}