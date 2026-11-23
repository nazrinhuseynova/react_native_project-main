import type { SkipSegment } from '../entities/SkipSegment';

export interface SkipSegmentRepository {
  listFor(titleId: string, episodeId: string | null): Promise<SkipSegment[]>;
}