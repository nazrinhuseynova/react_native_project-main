import { createMoney, type Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';
import type { PromoDiscountResult, PromoStrategy } from './PromoStrategy';

export class FreeTrialPromo implements PromoStrategy {
  readonly type = 'free_trial' as const;

  calculateDiscount(subtotal: Money, promo: PromoCode): PromoDiscountResult {
    const trialDays = Math.max(1, Math.round(promo.value));
    return {
      discount: createMoney(subtotal.amount, subtotal.currency),
      trialDays,
      applied: true,
    };
  }
}