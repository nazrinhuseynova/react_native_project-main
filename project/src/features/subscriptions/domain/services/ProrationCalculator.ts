import type { Plan } from '../entities/Plan';
import type { Subscription } from '../entities/Subscription';

export interface ProrationResult {
  creditMinor: number;
  chargeMinor: number;
  isUpgrade: boolean;
}

export class ProrationCalculator {
  calculate(
    currentPlan: Plan | null,
    nextPlan: Plan,
    subscription: Subscription | null,
    now: Date = new Date(),
  ): ProrationResult {
    if (!currentPlan || !subscription) {
      return { creditMinor: 0, chargeMinor: nextPlan.priceMinor, isUpgrade: true };
    }

    const start = new Date(subscription.currentPeriodStart).getTime();
    const end = new Date(subscription.currentPeriodEnd).getTime();
    const totalMs = Math.max(1, end - start);
    const remainingMs = Math.max(0, end - now.getTime());
    const remainingRatio = Math.min(1, remainingMs / totalMs);

    const creditMinor = Math.round(currentPlan.priceMinor * remainingRatio);
    const chargeMinor = Math.max(0, nextPlan.priceMinor - creditMinor);

    return {
      creditMinor,
      chargeMinor,
      isUpgrade: nextPlan.priceMinor >= currentPlan.priceMinor,
    };
  }
}
