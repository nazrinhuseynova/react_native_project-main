import { COMPLETE_THRESHOLD } from '@/core/config/constants';

export class CompletionPolicy {
  private readonly threshold: number;

  constructor(threshold: number = COMPLETE_THRESHOLD) {
    this.threshold = threshold;
  }

  isCompleted(positionSec: number, durationSec: number): boolean {
    return durationSec > 0 && positionSec / durationSec >= this.threshold;
  }
}