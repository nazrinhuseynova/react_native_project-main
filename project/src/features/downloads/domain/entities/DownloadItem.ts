import type { DownloadQuality } from './DownloadQuality';
import type { DownloadStatus } from './DownloadStatus';

export type DownloadItem = {
  id: string;
  titleId: string;
  episodeId: string | null;
  profileId: string;
  title: string;
  posterPath: string | null;
  quality: DownloadQuality;
  status: DownloadStatus;
  progress: number;
  bytesTotal: number;
  bytesDownloaded: number;
  fileUri: string | null;
  sourceUrl: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number | null;
  lastLicenseCheckAt: number | null;
};

export type NewDownloadInput = {
  profileId: string;
  titleId: string;
  episodeId: string | null;
  title: string;
  posterPath: string | null;
  quality: DownloadQuality;
  sourceUrl: string;
};

export function createDownloadItem(input: NewDownloadInput, id: string, now: number): DownloadItem {
  return {
    ...input,
    id,
    status: 'queued',
    progress: 0,
    bytesTotal: 0,
    bytesDownloaded: 0,
    fileUri: null,
    createdAt: now,
    updatedAt: now,
    expiresAt: null,
    lastLicenseCheckAt: null,
  };
}

export function downloadKey(titleId: string, episodeId: string | null): string {
  return episodeId ? `${titleId}#${episodeId}` : titleId;
}