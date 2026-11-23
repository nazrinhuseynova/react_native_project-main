import { MAX_PROFILES } from '@/core/config/constants';

export class ProfileLimitPolicy {
  readonly max: number;

  constructor(max = MAX_PROFILES) {
    this.max = max;
  }

  canCreate(currentCount: number): boolean {
    return currentCount < this.max;
  }

  remaining(currentCount: number): number {
    return Math.max(0, this.max - currentCount);
  }
}