import { AppError } from '@/core/errors/AppError';
import { NotFoundError } from '@/core/errors/NotFoundError';

import type { DownloadEngine } from '../ports/DownloadEngine';
import type { WifiOnlyPolicy } from '../policies/WifiOnlyPolicy';
import type { DownloadRepository } from '../repositories/DownloadRepository';
import type { NetworkContext } from './EnqueueDownload';

export class ResumeDownload {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;
  private readonly wifi: WifiOnlyPolicy;

  constructor(repository: DownloadRepository, engine: DownloadEngine, wifi: WifiOnlyPolicy) {
    this.repository = repository;
    this.engine = engine;
    this.wifi = wifi;
  }

  async execute(id: string, network: NetworkContext): Promise<void> {
    const item = await this.repository.get(id);
    if (!item) throw new NotFoundError('Download not found', { resource: 'download' });

    if (!this.wifi.canDownload(network.connection, network.wifiOnly)) {
      throw new AppError('Download blocked by network policy', {
        code: 'DOWNLOAD_NETWORK',
        userMessageKey: network.connection === 'none' ? 'errors.network.offline' : 'downloads.errors.wifiOnly',
      });
    }

    await this.repository.patch(id, { status: 'queued', updatedAt: Date.now() });
    await this.engine.start({ ...item, status: 'queued' });
  }
}