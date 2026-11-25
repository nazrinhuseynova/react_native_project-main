export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';

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
