import type { Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';

export interface PromoDiscountResult {
  discount: Money;
  trialDays?: number;
  applied: boolean;
  reason?: string;
}

export interface PromoStrategy {
  readonly type: PromoCode['type'];
  calculateDiscount(subtotal: Money, promo: PromoCode, now?: Date): PromoDiscountResult;
}