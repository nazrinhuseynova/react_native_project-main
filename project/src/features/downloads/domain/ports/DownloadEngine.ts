import type { DownloadItem } from '../entities/DownloadItem';
import type { DownloadQuality } from '../entities/DownloadQuality';

export type DownloadEngineEvent =
  | { type: 'progress'; id: string; bytesDownloaded: number; bytesTotal: number }
  | { type: 'completed'; id: string; fileUri: string; bytesTotal: number }
  | { type: 'paused'; id: string }
  | { type: 'failed'; id: string; message: string };

export interface DownloadEngine {
  start(item: DownloadItem): Promise<void>;
  pause(id: string): Promise<void>;
  cancel(id: string): Promise<void>;
  deleteFile(fileUri: string): Promise<void>;
  subscribe(listener: (event: DownloadEngineEvent) => void): () => void;
}

export type DownloadSourceResolver = (request: {
  titleId: string;
  episodeId: string | null;
  quality: DownloadQuality;
}) => Promise<string>;