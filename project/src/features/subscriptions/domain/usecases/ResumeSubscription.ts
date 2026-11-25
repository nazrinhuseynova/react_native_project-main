import { AppError } from '@/core/errors/AppError';

import type { Subscription } from '../entities/Subscription';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { CancelPolicy } from '../services/CancelPolicy';

export class ResumeSubscription {
  constructor(
    private readonly subscriptions: SubscriptionRepository,
    private readonly policy: CancelPolicy = new CancelPolicy(),
  ) {}

  async execute(userId: string): Promise<Subscription> {
    const current = await this.subscriptions.getByUser(userId);
    if (!current || !this.policy.canResume(current)) {
      throw new AppError('Subscription cannot be resumed', {
        code: 'SUBSCRIPTION_RESUME_INVALID',
        userMessageKey: 'subscription.error',
      });
    }

    return this.subscriptions.setCancelAtPeriodEnd(current.id, false, null);
  }
}
