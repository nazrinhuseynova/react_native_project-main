export interface GracePeriodStatus {
  inGracePeriod: boolean;
  daysLeft: number;
  expiresAt: string;
}

const DEFAULT_GRACE_DAYS = 3;

export class GracePeriodPolicy {
  constructor(private readonly graceDays: number = DEFAULT_GRACE_DAYS) {}

  evaluate(failedAtIso: string, now: Date = new Date()): GracePeriodStatus {
    const failedAt = new Date(failedAtIso);
    const expiresAt = new Date(failedAt.getTime() + this.graceDays * 24 * 60 * 60 * 1000);
    const diffMs = expiresAt.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      inGracePeriod: diffMs > 0,
      daysLeft,
      expiresAt: expiresAt.toISOString(),
    };
  }
}