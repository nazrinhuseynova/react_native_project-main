export type SkipSegmentKind = 'intro' | 'recap';

export type SkipSegment = {
  id: string;
  titleId: string;
  episodeId: string | null;
  kind: SkipSegmentKind;
  startSec: number;
  endSec: number;
};

export function isValidSegment(segment: Pick<SkipSegment, 'startSec' | 'endSec'>): boolean {
  return (
    Number.isFinite(segment.startSec) &&
    Number.isFinite(segment.endSec) &&
    segment.startSec >= 0 &&
    segment.endSec > segment.startSec
  );
}