import type { TitleId } from '@/features/catalog';

export type WatchProgress = {
  titleId: TitleId;
  episodeId: string | null;
  positionSec: number;
  durationSec: number;
  completedAt: string | null;
  updatedAt: string;
};

export function progressFraction(progress: Pick<WatchProgress, 'positionSec' | 'durationSec'>): number {
  if (progress.durationSec <= 0) return 0;
  return Math.min(Math.max(progress.positionSec / progress.durationSec, 0), 1);
}