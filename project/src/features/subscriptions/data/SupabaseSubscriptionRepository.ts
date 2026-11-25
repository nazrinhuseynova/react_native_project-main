import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { createId } from '@/core/utils/createId';

import type { Subscription, SubscriptionStatus } from '../domain/entities/Subscription';
import type {
  SubscriptionRepository,
  UpsertSubscriptionInput,
} from '../domain/repositories/SubscriptionRepository';

const TABLE = 'subscriptions';

type SubscriptionRow = {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
};

function toSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    status: row.status as SubscriptionStatus,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    canceledAt: row.canceled_at,
    createdAt: row.created_at,
  };
}

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === 'PGRST205' || /could not find the table/i.test(error.message ?? '');
}

const memoryFallback = new Map<string, Subscription>();

export class SupabaseSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getByUser(userId: string): Promise<Subscription | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (isMissingTableError(error)) {
        return memoryFallback.get(userId) ?? null;
      }
      throw new AppError('Failed to load subscription', {
        code: 'SUBSCRIPTION',
        userMessageKey: 'subscription.error',
        cause: error,
      });
    }

    return data ? toSubscription(data as SubscriptionRow) : null;
  }

  async upsert(input: UpsertSubscriptionInput): Promise<Subscription> {
    const { data, error } = await this.client
      .from(TABLE)
      .upsert(
        {
          user_id: input.userId,
          plan_id: input.planId,
          status: input.status,
          current_period_start: input.currentPeriodStart,
          current_period_end: input.currentPeriodEnd,
          cancel_at_period_end: input.cancelAtPeriodEnd,
          canceled_at: input.canceledAt,
        },
        { onConflict: 'user_id' },
      )
      .select('*')
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        const local: Subscription = {
          id: memoryFallback.get(input.userId)?.id ?? createId(),
          userId: input.userId,
          planId: input.planId,
          status: input.status,
          currentPeriodStart: input.currentPeriodStart,
          currentPeriodEnd: input.currentPeriodEnd,
          cancelAtPeriodEnd: input.cancelAtPeriodEnd,
          canceledAt: input.canceledAt,
          createdAt: new Date().toISOString(),
        };
        memoryFallback.set(input.userId, local);
        return local;
      }
      throw new AppError('Failed to update subscription', {
        code: 'SUBSCRIPTION',
        userMessageKey: 'subscription.error',
        cause: error,
      });
    }

    return toSubscription(data as SubscriptionRow);
  }

  async setCancelAtPeriodEnd(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean,
    canceledAt: string | null,
  ): Promise<Subscription> {
    const { data, error } = await this.client
      .from(TABLE)
      .update({
        cancel_at_period_end: cancelAtPeriodEnd,
        canceled_at: canceledAt,
        status: cancelAtPeriodEnd ? 'canceled' : 'active',
      })
      .eq('id', subscriptionId)
      .select('*')
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        for (const [userId, sub] of memoryFallback.entries()) {
          if (sub.id === subscriptionId) {
            const updated: Subscription = {
              ...sub,
              cancelAtPeriodEnd,
              canceledAt,
              status: cancelAtPeriodEnd ? 'canceled' : 'active',
            };
            memoryFallback.set(userId, updated);
            return updated;
          }
        }
      }
      throw new AppError('Failed to update subscription status', {
        code: 'SUBSCRIPTION',
        userMessageKey: 'subscription.error',
        cause: error,
      });
    }

    return toSubscription(data as SubscriptionRow);
  }
}