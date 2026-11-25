import { AppError } from '@/core/errors/AppError';
import type {
  InvoiceRepository,
  PaymentGateway,
  PaymentMethod,
  PaymentMethodRepository,
} from '@/features/payments';

import type { Subscription } from '../entities/Subscription';
import { isSubscriptionEntitled } from '../entities/Subscription';
import type { PlanRepository } from '../repositories/PlanRepository';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { CancelPolicy } from '../services/CancelPolicy';
import { ProrationCalculator } from '../services/ProrationCalculator';
import { RenewalPolicy } from '../services/RenewalPolicy';

export const NO_PAYMENT_METHOD = 'NO_PAYMENT_METHOD';

export type ChangePlanKind = 'subscribed' | 'resumed' | 'cancel_scheduled' | 'unchanged';

export interface ChangePlanOutcome {
  kind: ChangePlanKind;
  subscription: Subscription | null;
  planId: string;
  chargedMinor: number;
  currency: string;
}

export interface ChangePlanPayments {
  gateway: PaymentGateway;
  methods: PaymentMethodRepository;
  invoices: InvoiceRepository;
}

function pickMethod(methods: PaymentMethod[]): PaymentMethod | null {
  return methods.find((m) => m.isDefault) ?? methods[0] ?? null;
}

export class ChangePlan {
  constructor(
    private readonly plans: PlanRepository,
    private readonly subscriptions: SubscriptionRepository,
    private readonly payments: ChangePlanPayments,
    private readonly renewal: RenewalPolicy = new RenewalPolicy(),
    private readonly proration: ProrationCalculator = new ProrationCalculator(),
    private readonly cancelPolicy: CancelPolicy = new CancelPolicy(),
  ) {}

  async execute(userId: string, nextPlanId: string): Promise<ChangePlanOutcome> {
    const nextPlan = await this.plans.getById(nextPlanId);
    if (!nextPlan) {
      throw new AppError('Plan not found', {
        code: 'PLAN_NOT_FOUND',
        userMessageKey: 'plans.error',
      });
    }

    const stored = await this.subscriptions.getByUser(userId);

    const current = stored && isSubscriptionEntitled(stored) ? stored : null;
    const currentPlan = current ? await this.plans.getById(current.planId) : null;
    const currentIsPaid = (currentPlan?.priceMinor ?? 0) > 0;

    const base = { planId: nextPlan.id, currency: nextPlan.currency };

  
    if (current && current.planId === nextPlan.id) {
      if (this.cancelPolicy.canResume(current)) {
        const resumed = await this.subscriptions.setCancelAtPeriodEnd(current.id, false, null);
        return { ...base, kind: 'resumed', subscription: resumed, chargedMinor: 0 };
      }
      return { ...base, kind: 'unchanged', subscription: current, chargedMinor: 0 };
    }


    if (nextPlan.priceMinor === 0) {
      if (current && currentIsPaid && this.cancelPolicy.canCancel(current)) {
        const canceled = await this.subscriptions.setCancelAtPeriodEnd(
          current.id,
          true,
          new Date().toISOString(),
        );
        return { ...base, kind: 'cancel_scheduled', subscription: canceled, chargedMinor: 0 };
      }
      return { ...base, kind: 'unchanged', subscription: current, chargedMinor: 0 };
    }

  
    const { chargeMinor } = this.proration.calculate(currentPlan, nextPlan, current);

    if (chargeMinor > 0) {
      const methods = await this.payments.methods.listByUser(userId);
      const method = pickMethod(methods);
      if (!method) {
        throw new AppError('No payment method', {
          code: NO_PAYMENT_METHOD,
          userMessageKey: 'subscription.noCard',
        });
      }

      const description = `${nextPlan.name} subscription`;
      const result = await this.payments.gateway.charge({
        amount: { amount: chargeMinor, currency: nextPlan.currency },
        paymentMethod: method,
        description,
        idempotencyKey: `${userId}_subscription_${nextPlan.id}_${Date.now()}`,
      });

      if (result.status === 'requires_3ds') {
        throw new AppError('3DS required', {
          code: 'PAYMENT_3DS',
          userMessageKey: 'subscription.requires3ds',
        });
      }
      if (result.status === 'declined') {
        throw new AppError(result.message, {
          code: 'PAYMENT_DECLINED',
          userMessageKey: 'subscription.paymentFailed',
          details: { reason: result.reason, message: result.message },
        });
      }

    
      try {
        await this.payments.invoices.create({
          userId,
          description,
          itemKind: 'subscription',
          itemId: nextPlan.id,
          subtotalAmount: chargeMinor,
          discountAmount: 0,
          totalAmount: chargeMinor,
          currency: nextPlan.currency,
          paymentMethodLast4: method.last4,
          status: 'paid',
        });
      } catch (error) {
        console.warn('[ChangePlan] invoice could not be saved', error);
      }
    }

    const period = this.renewal.nextPeriod();
    const subscription = await this.subscriptions.upsert({
      userId,
      planId: nextPlan.id,
      status: 'active',
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
      cancelAtPeriodEnd: false,
      canceledAt: null,
    });

    return { ...base, kind: 'subscribed', subscription, chargedMinor: chargeMinor };
  }
}