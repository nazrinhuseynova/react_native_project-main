import { isValidSegment, type SkipSegment } from '../entities/SkipSegment';

export class SkipSegmentFinder {
  find(segments: readonly SkipSegment[], positionSec: number): SkipSegment | null {
    return (
      segments.find(
        (segment) =>
          isValidSegment(segment) && positionSec >= segment.startSec && positionSec < segment.endSec,
      ) ?? null
    );
  }
}