import { createMoney, subtractMoney, type Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';
import type { PromoStrategy } from '../promo/PromoStrategy';

export interface PriceBreakdown {
  subtotal: Money;
  discount: Money;
  total: Money;
  trialDays?: number;
}

export class PricingService {
  constructor(private readonly strategies: Record<PromoCode['type'], PromoStrategy>) {}

  calculate(subtotal: Money, promo?: PromoCode | null, now: Date = new Date()): PriceBreakdown {
    if (!promo) {
      return {
        subtotal,
        discount: createMoney(0, subtotal.currency),
        total: subtotal,
      };
    }

    if (!promo.active) {
      return {
        subtotal,
        discount: createMoney(0, subtotal.currency),
        total: subtotal,
      };
    }

    if (promo.expiresAt && new Date(promo.expiresAt).getTime() < now.getTime()) {
      return {
        subtotal,
        discount: createMoney(0, subtotal.currency),
        total: subtotal,
      };
    }

    if (promo.maxRedemptions !== undefined && promo.redeemedCount >= promo.maxRedemptions) {
      return {
        subtotal,
        discount: createMoney(0, subtotal.currency),
        total: subtotal,
      };
    }

    const strategy = this.strategies[promo.type];
    if (!strategy) {
      return {
        subtotal,
        discount: createMoney(0, subtotal.currency),
        total: subtotal,
      };
    }

    const result = strategy.calculateDiscount(subtotal, promo, now);
    const total = subtractMoney(subtotal, result.discount);

    return {
      subtotal,
      discount: result.discount,
      total,
      trialDays: result.trialDays,
    };
  }
}