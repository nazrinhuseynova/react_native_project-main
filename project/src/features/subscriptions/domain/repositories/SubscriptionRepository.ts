import type { Subscription } from '../entities/Subscription';

export interface UpsertSubscriptionInput {
  userId: string;
  planId: string;
  status: Subscription['status'];
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
}

export interface SubscriptionRepository {
  getByUser(userId: string): Promise<Subscription | null>;
  upsert(input: UpsertSubscriptionInput): Promise<Subscription>;
  setCancelAtPeriodEnd(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean,
    canceledAt: string | null,
  ): Promise<Subscription>;
}
