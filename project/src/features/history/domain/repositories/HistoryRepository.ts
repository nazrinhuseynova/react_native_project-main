import type { TitleId } from '@/features/catalog';

import type { WatchProgress } from '../entities/WatchProgress';

export interface HistoryRepository {
  list(profileId: string): Promise<WatchProgress[]>;
  find(profileId: string, titleId: TitleId): Promise<WatchProgress | null>;
  save(profileId: string, progress: WatchProgress): Promise<void>;
  remove(profileId: string, titleId: TitleId): Promise<void>;
  clear(profileId: string): Promise<void>;
}