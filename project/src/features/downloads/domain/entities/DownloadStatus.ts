export const DOWNLOAD_STATUSES = [
  'queued',
  'downloading',
  'paused',
  'completed',
  'failed',
  'expired',
] as const;

export type DownloadStatus = (typeof DOWNLOAD_STATUSES)[number];

export function isDownloadStatus(value: string): value is DownloadStatus {
  return (DOWNLOAD_STATUSES as readonly string[]).includes(value);
}

export function isInProgress(status: DownloadStatus): boolean {
  return status === 'queued' || status === 'downloading' || status === 'paused';
}