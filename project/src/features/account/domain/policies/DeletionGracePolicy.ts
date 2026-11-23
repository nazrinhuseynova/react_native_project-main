import { DELETE_GRACE_DAYS } from '@/core/config/constants';

const DAY_MS = 24 * 60 * 60 * 1000;

export class DeletionGracePolicy {
  readonly graceDays: number;

  constructor(graceDays = DELETE_GRACE_DAYS) {
    this.graceDays = graceDays;
  }

  deadline(requestedAt: Date | string): Date {
    return new Date(new Date(requestedAt).getTime() + this.graceDays * DAY_MS);
  }

  daysLeft(requestedAt: Date | string, now: Date = new Date()): number {
    const remaining = this.deadline(requestedAt).getTime() - now.getTime();
    return Math.max(0, Math.ceil(remaining / DAY_MS));
  }

  canRestore(requestedAt: Date | string, now: Date = new Date()): boolean {
    return now.getTime() < this.deadline(requestedAt).getTime();
  }
}