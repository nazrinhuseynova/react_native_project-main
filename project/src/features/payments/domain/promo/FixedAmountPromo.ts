import { createMoney, type Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';
import type { PromoDiscountResult, PromoStrategy } from './PromoStrategy';

export class FixedAmountPromo implements PromoStrategy {
  readonly type = 'fixed_amount' as const;

  calculateDiscount(subtotal: Money, promo: PromoCode): PromoDiscountResult {
    if (promo.currency && promo.currency !== subtotal.currency) {
      return {
        discount: createMoney(0, subtotal.currency),
        applied: false,
        reason: 'currency_mismatch',
      };
    }
    const capped = Math.min(subtotal.amount, Math.max(0, promo.value));
    return {
      discount: createMoney(capped, subtotal.currency),
      applied: true,
    };
  }
}