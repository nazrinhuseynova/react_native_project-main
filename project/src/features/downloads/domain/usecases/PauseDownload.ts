import type { DownloadEngine } from '../ports/DownloadEngine';
import type { DownloadRepository } from '../repositories/DownloadRepository';

export class PauseDownload {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;

  constructor(repository: DownloadRepository, engine: DownloadEngine) {
    this.repository = repository;
    this.engine = engine;
  }

  async execute(id: string): Promise<void> {
    await this.engine.pause(id);
    await this.repository.patch(id, { status: 'paused', updatedAt: Date.now() });
  }
}