import type { Money } from '../entities/Money';
import type { PromoCode } from '../entities/PromoCode';
import type { PromoRepository } from '../../repositories/PromoRepository';
import { PricingService, type PriceBreakdown } from '../services/PricingService';

export interface ApplyPromoCommand {
  code: string;
  subtotal: Money;
}

export interface ApplyPromoResult {
  promo: PromoCode;
  breakdown: PriceBreakdown;
}

export class ApplyPromo {
  constructor(
    private readonly promoRepo: PromoRepository,
    private readonly pricingService: PricingService,
  ) {}

  async execute(command: ApplyPromoCommand): Promise<ApplyPromoResult> {
    const normalized = command.code.trim().toUpperCase();
    if (!normalized) {
      throw new Error('Promo code is empty');
    }

    const promo = await this.promoRepo.findByCode(normalized);
    if (!promo || !promo.active) {
      throw new Error('Invalid or inactive promo code');
    }

    if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
      throw new Error('Promo code has expired');
    }

    if (promo.maxRedemptions !== undefined && promo.redeemedCount >= promo.maxRedemptions) {
      throw new Error('Promo code usage limit reached');
    }

    const breakdown = this.pricingService.calculate(command.subtotal, promo);
    return { promo, breakdown };
  }
}