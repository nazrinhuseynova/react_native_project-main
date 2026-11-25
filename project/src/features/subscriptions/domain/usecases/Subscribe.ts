import { AppError } from '@/core/errors/AppError';

import type { Subscription } from '../entities/Subscription';
import type { PlanRepository } from '../repositories/PlanRepository';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { RenewalPolicy } from '../services/RenewalPolicy';

export class Subscribe {
  constructor(
    private readonly plans: PlanRepository,
    private readonly subscriptions: SubscriptionRepository,
    private readonly renewal: RenewalPolicy = new RenewalPolicy(),
  ) {}

  async execute(userId: string, planId: string): Promise<Subscription> {
    const plan = await this.plans.getById(planId);
    if (!plan) {
      throw new AppError('Plan not found', {
        code: 'PLAN_NOT_FOUND',
        userMessageKey: 'plans.error',
      });
    }

    const period = this.renewal.nextPeriod();
    return this.subscriptions.upsert({
      userId,
      planId: plan.id,
      status: 'active',
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
      cancelAtPeriodEnd: false,
      canceledAt: null,
    });
  }
}
