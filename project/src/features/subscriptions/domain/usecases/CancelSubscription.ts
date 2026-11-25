import { AppError } from '@/core/errors/AppError';

import type { Subscription } from '../entities/Subscription';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { CancelPolicy } from '../services/CancelPolicy';

export class CancelSubscription {
  constructor(
    private readonly subscriptions: SubscriptionRepository,
    private readonly policy: CancelPolicy = new CancelPolicy(),
  ) {}

  async execute(userId: string): Promise<Subscription> {
    const current = await this.subscriptions.getByUser(userId);
    if (!current || !this.policy.canCancel(current)) {
      throw new AppError('Subscription cannot be canceled', {
        code: 'SUBSCRIPTION_CANCEL_INVALID',
        userMessageKey: 'subscription.error',
      });
    }

    return this.subscriptions.setCancelAtPeriodEnd(
      current.id,
      true,
      new Date().toISOString(),
    );
  }
}
