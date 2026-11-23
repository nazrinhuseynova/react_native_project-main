import { multiplyMoney, type Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';
import type { PromoDiscountResult, PromoStrategy } from './PromoStrategy';

export class PercentPromo implements PromoStrategy {
  readonly type = 'percent' as const;

  calculateDiscount(subtotal: Money, promo: PromoCode): PromoDiscountResult {
    const clampedPercent = Math.max(0, Math.min(100, promo.value));
    const discount = multiplyMoney(subtotal, clampedPercent / 100);
    return {
      discount,
      applied: true,
    };
  }
}