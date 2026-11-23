import { clamp } from '@/core/utils/clamp';

export class SeekCalculator {
  seekBy(currentSec: number, deltaSec: number, durationSec: number): number {
    return this.clampTo(currentSec + deltaSec, durationSec);
  }

  clampTo(targetSec: number, durationSec: number): number {
    const max = durationSec > 0 ? durationSec : Number.MAX_SAFE_INTEGER;
    return clamp(targetSec, 0, max);
  }

  fractionToSeconds(fraction: number, durationSec: number): number {
    return clamp(fraction, 0, 1) * Math.max(0, durationSec);
  }

  secondsToFraction(positionSec: number, durationSec: number): number {
    if (durationSec <= 0) return 0;
    return clamp(positionSec / durationSec, 0, 1);
  }
}