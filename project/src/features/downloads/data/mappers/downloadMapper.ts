import type { DownloadItem } from '../../domain/entities/DownloadItem';
import { isDownloadQuality, type DownloadQuality } from '../../domain/entities/DownloadQuality';
import { isDownloadStatus, type DownloadStatus } from '../../domain/entities/DownloadStatus';
import type { DownloadPatch } from '../../domain/repositories/DownloadRepository';

export type DownloadRow = {
  id: string;
  title_id: string;
  episode_id: string | null;
  profile_id: string;
  title: string;
  poster_path: string | null;
  quality: string;
  status: string;
  progress: number;
  bytes_total: number;
  bytes_downloaded: number;
  file_uri: string | null;
  source_url: string;
  created_at: number;
  updated_at: number;
  expires_at: number | null;
  last_license_check_at: number | null;
};

export const DOWNLOAD_COLUMNS = [
  'id',
  'title_id',
  'episode_id',
  'profile_id',
  'title',
  'poster_path',
  'quality',
  'status',
  'progress',
  'bytes_total',
  'bytes_downloaded',
  'file_uri',
  'source_url',
  'created_at',
  'updated_at',
  'expires_at',
  'last_license_check_at',
] as const satisfies ReadonlyArray<keyof DownloadRow>;

export function toDownloadItem(row: DownloadRow): DownloadItem {
  return {
    id: row.id,
    titleId: row.title_id,
    episodeId: row.episode_id,
    profileId: row.profile_id,
    title: row.title,
    posterPath: row.poster_path,
    quality: (isDownloadQuality(row.quality) ? row.quality : 'standard') as DownloadQuality,
    status: (isDownloadStatus(row.status) ? row.status : 'failed') as DownloadStatus,
    progress: row.progress,
    bytesTotal: row.bytes_total,
    bytesDownloaded: row.bytes_downloaded,
    fileUri: row.file_uri,
    sourceUrl: row.source_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
    lastLicenseCheckAt: row.last_license_check_at,
  };
}

export type SqlValue = string | number | null;

export function toRowValues(item: DownloadItem): SqlValue[] {
  return [
    item.id,
    item.titleId,
    item.episodeId,
    item.profileId,
    item.title,
    item.posterPath,
    item.quality,
    item.status,
    item.progress,
    item.bytesTotal,
    item.bytesDownloaded,
    item.fileUri,
    item.sourceUrl,
    item.createdAt,
    item.updatedAt,
    item.expiresAt,
    item.lastLicenseCheckAt,
  ];
}

export function toRowPatch(patch: DownloadPatch): Record<string, SqlValue> {
  const row: Record<string, SqlValue> = {};
  if (patch.titleId !== undefined) row.title_id = patch.titleId;
  if (patch.episodeId !== undefined) row.episode_id = patch.episodeId;
  if (patch.profileId !== undefined) row.profile_id = patch.profileId;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.posterPath !== undefined) row.poster_path = patch.posterPath;
  if (patch.quality !== undefined) row.quality = patch.quality;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.progress !== undefined) row.progress = patch.progress;
  if (patch.bytesTotal !== undefined) row.bytes_total = patch.bytesTotal;
  if (patch.bytesDownloaded !== undefined) row.bytes_downloaded = patch.bytesDownloaded;
  if (patch.fileUri !== undefined) row.file_uri = patch.fileUri;
  if (patch.sourceUrl !== undefined) row.source_url = patch.sourceUrl;
  if (patch.createdAt !== undefined) row.created_at = patch.createdAt;
  if (patch.updatedAt !== undefined) row.updated_at = patch.updatedAt;
  if (patch.expiresAt !== undefined) row.expires_at = patch.expiresAt;
  if (patch.lastLicenseCheckAt !== undefined) row.last_license_check_at = patch.lastLicenseCheckAt;
  return row;
}