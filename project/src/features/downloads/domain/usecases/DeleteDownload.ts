import type { DownloadEngine } from '../ports/DownloadEngine';
import type { DownloadRepository } from '../repositories/DownloadRepository';

export class DeleteDownload {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;

  constructor(repository: DownloadRepository, engine: DownloadEngine) {
    this.repository = repository;
    this.engine = engine;
  }

  async execute(id: string): Promise<void> {
    const item = await this.repository.get(id);
    if (!item) return;
    await this.engine.cancel(id);
    if (item.fileUri) await this.engine.deleteFile(item.fileUri);
    await this.repository.remove(id);
  }
}