const BILLING_PERIOD_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export class RenewalPolicy {
  nextPeriod(from: Date = new Date()): { start: string; end: string } {
    const start = from.toISOString();
    const end = new Date(from.getTime() + BILLING_PERIOD_DAYS * DAY_MS).toISOString();
    return { start, end };
  }

  daysRemaining(periodEndIso: string, now: Date = new Date()): number {
    const diff = new Date(periodEndIso).getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / DAY_MS));
  }
}
