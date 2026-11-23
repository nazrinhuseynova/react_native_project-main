import type { DownloadItem } from '../entities/DownloadItem';

export type DownloadPatch = Partial<Omit<DownloadItem, 'id'>>;

export interface DownloadRepository {
  list(profileId: string): Promise<DownloadItem[]>;
  listAll(): Promise<DownloadItem[]>;
  get(id: string): Promise<DownloadItem | null>;
  find(profileId: string, titleId: string, episodeId: string | null): Promise<DownloadItem | null>;
  save(item: DownloadItem): Promise<void>;
  patch(id: string, patch: DownloadPatch): Promise<void>;
  remove(id: string): Promise<void>;
}