import type {
  EntitlementDecision,
  EntitlementGate,
  EntitlementRequest,
} from '@/features/player';

import { isSubscriptionEntitled } from '../domain/entities/Subscription';
import type { SubscriptionRepository } from '../domain/repositories/SubscriptionRepository';

export class PlanEntitlement implements EntitlementGate {
  constructor(
    private readonly getUserId: () => string | null,
    private readonly subscriptions: SubscriptionRepository,
  ) {}

  async check(_request: EntitlementRequest): Promise<EntitlementDecision> {
    const userId = this.getUserId();
    if (!userId) return { allowed: false, reason: 'no_access' };

    const subscription = await this.subscriptions.getByUser(userId);
    if (!subscription) return { allowed: false, reason: 'no_subscription' };
    if (subscription.status === 'past_due') {
      return { allowed: false, reason: 'subscription_past_due' };
    }
    if (!isSubscriptionEntitled(subscription)) {
      return { allowed: false, reason: 'no_subscription' };
    }

    return { allowed: true, source: 'subscription' };
  }
}
