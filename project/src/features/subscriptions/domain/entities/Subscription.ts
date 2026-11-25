export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';
export type SubscriptionState = 'none' | 'active' | 'canceled' | 'past_due' | 'expired';
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
}

export function isSubscriptionEntitled(
  subscription: Subscription | null,
  now: Date = new Date(),
): boolean {
  if (!subscription) return false;
  if (subscription.status === 'expired') return false;
  return new Date(subscription.currentPeriodEnd).getTime() > now.getTime();
}

export function getSubscriptionState(
  subscription: Subscription | null,
  now: Date = new Date(),
): SubscriptionState {
  if (!subscription) return 'none';
  if (!isSubscriptionEntitled(subscription, now)) return 'expired';
  if (subscription.status === 'past_due') return 'past_due';
  if (subscription.cancelAtPeriodEnd || subscription.status === 'canceled') return 'canceled';
  return 'active';
}