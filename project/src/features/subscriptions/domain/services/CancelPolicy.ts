import type { Subscription } from '../entities/Subscription';

export class CancelPolicy {
  canCancel(subscription: Subscription | null): boolean {
    if (!subscription) return false;
    return subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
  }

  canResume(subscription: Subscription | null, now: Date = new Date()): boolean {
    if (!subscription) return false;
    return (
      subscription.cancelAtPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() > now.getTime()
    );
  }
}
