import type { Subscription } from '../entities/Subscription';
import type { PlanRepository } from '../repositories/PlanRepository';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { RenewalPolicy } from '../services/RenewalPolicy';
import { Subscribe } from './Subscribe';

export class ChangePlan {
  private readonly subscribe: Subscribe;

  constructor(
    plans: PlanRepository,
    subscriptions: SubscriptionRepository,
    renewal: RenewalPolicy = new RenewalPolicy(),
  ) {
    this.subscribe = new Subscribe(plans, subscriptions, renewal);
  }

  execute(userId: string, nextPlanId: string): Promise<Subscription> {
    return this.subscribe.execute(userId, nextPlanId);
  }
}
