// NOTE: expo-file-system SDK 54+-da köhnə API "expo-file-system/legacy" altındadır.
// SDK 58-də bu yolun hələ mövcud olduğunu yoxlayın; yoxdursa File/Directory API-sinə keçin.
import * as FileSystem from 'expo-file-system/legacy';

import type { DownloadItem } from '../domain/entities/DownloadItem';
import type { DownloadEngine, DownloadEngineEvent } from '../domain/ports/DownloadEngine';

const DIRECTORY = `${FileSystem.documentDirectory ?? ''}downloads/`;

/**
 * Fayllar tətbiqin özəl qovluğunda saxlanır. Real DRM şifrələməsi YOXDUR (dürüstlük qeydi).
 * Tətbiq yenidən açılanda yarımçıq yükləmələr sıfırdan başlayır (resume data yaddaşdadır).
 */
export class ExpoFileDownloadEngine implements DownloadEngine {
  private readonly listeners = new Set<(event: DownloadEngineEvent) => void>();
  private readonly active = new Map<string, FileSystem.DownloadResumable>();
  private readonly paused = new Set<string>();

  subscribe(listener: (event: DownloadEngineEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async start(item: DownloadItem): Promise<void> {
    await FileSystem.makeDirectoryAsync(DIRECTORY, { intermediates: true }).catch(() => undefined);

    const wasPaused = this.paused.delete(item.id);
    let resumable = this.active.get(item.id);

    if (!resumable) {
      resumable = FileSystem.createDownloadResumable(
        item.sourceUrl,
        `${DIRECTORY}${item.id}.mp4`,
        {},
        (progress) =>
          this.emit({
            type: 'progress',
            id: item.id,
            bytesDownloaded: progress.totalBytesWritten,
            bytesTotal: progress.totalBytesExpectedToWrite,
          }),
      );
      this.active.set(item.id, resumable);
    }

    void this.run(item.id, resumable, wasPaused);
  }

  async pause(id: string): Promise<void> {
    const resumable = this.active.get(id);
    if (!resumable) return;
    this.paused.add(id);
    await resumable.pauseAsync().catch(() => undefined);
    this.emit({ type: 'paused', id });
  }

  async cancel(id: string): Promise<void> {
    this.paused.add(id);
    const resumable = this.active.get(id);
    this.active.delete(id);
    await resumable?.pauseAsync().catch(() => undefined);
    this.paused.delete(id);
    await FileSystem.deleteAsync(`${DIRECTORY}${id}.mp4`, { idempotent: true }).catch(() => undefined);
  }

  async deleteFile(fileUri: string): Promise<void> {
    await FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(() => undefined);
  }

  private async run(id: string, resumable: FileSystem.DownloadResumable, resume: boolean): Promise<void> {
    try {
      const result = resume ? await resumable.resumeAsync() : await resumable.downloadAsync();
      if (!result || this.paused.has(id) || !this.active.has(id)) return;
      if (result.status >= 400) throw new Error(`HTTP ${result.status}`);

      const info = await FileSystem.getInfoAsync(result.uri);
      this.active.delete(id);
      this.emit({
        type: 'completed',
        id,
        fileUri: result.uri,
        bytesTotal: info.exists && typeof info.size === 'number' ? info.size : 0,
      });
    } catch (error) {
      if (this.paused.has(id) || !this.active.has(id)) return;
      this.active.delete(id);
      this.emit({ type: 'failed', id, message: String(error) });
    }
  }

  private emit(event: DownloadEngineEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}