import { AppError } from '@/core/errors/AppError';
import type { ConnectionType } from '@/core/network/NetworkMonitor';
import { createId } from '@/core/utils/createId';

import { createDownloadItem, type DownloadItem } from '../entities/DownloadItem';
import type { DownloadQuality } from '../entities/DownloadQuality';
import type { DownloadEngine, DownloadSourceResolver } from '../ports/DownloadEngine';
import type { WifiOnlyPolicy } from '../policies/WifiOnlyPolicy';
import type { DownloadRepository } from '../repositories/DownloadRepository';

export type EnqueueInput = {
  profileId: string;
  titleId: string;
  episodeId: string | null;
  title: string;
  posterPath: string | null;
  quality: DownloadQuality;
};

export type NetworkContext = {
  connection: ConnectionType;
  wifiOnly: boolean;
 
  deferIfBlocked?: boolean;
};

export class EnqueueDownload {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;
  private readonly resolveSource: DownloadSourceResolver;
  private readonly wifi: WifiOnlyPolicy;

  constructor(
    repository: DownloadRepository,
    engine: DownloadEngine,
    resolveSource: DownloadSourceResolver,
    wifi: WifiOnlyPolicy,
  ) {
    this.repository = repository;
    this.engine = engine;
    this.resolveSource = resolveSource;
    this.wifi = wifi;
  }

  async execute(input: EnqueueInput, network: NetworkContext): Promise<DownloadItem> {
    const existing = await this.repository.find(input.profileId, input.titleId, input.episodeId);
    if (existing && existing.status !== 'failed' && existing.status !== 'expired') return existing;

    const allowed = this.wifi.canDownload(network.connection, network.wifiOnly);
    if (!allowed && !network.deferIfBlocked) {
      throw new AppError('Download blocked by network policy', {
        code: 'DOWNLOAD_NETWORK',
        userMessageKey: network.connection === 'none' ? 'errors.network.offline' : 'downloads.errors.wifiOnly',
      });
    }

    if (existing) {
      await this.engine.cancel(existing.id);
      if (existing.fileUri) await this.engine.deleteFile(existing.fileUri);
      await this.repository.remove(existing.id);
    }

    const sourceUrl = await this.resolveSource({
      titleId: input.titleId,
      episodeId: input.episodeId,
      quality: input.quality,
    });

    const item = createDownloadItem({ ...input, sourceUrl }, createId(), Date.now());
    await this.repository.save(item);
    if (allowed) await this.engine.start(item);
    return item;
  }
}