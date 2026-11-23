import type { PromoCode } from '../domain/entities/PromoCode';
import { FixedAmountPromo } from '../domain/promo/FixedAmountPromo';
import { FreeTrialPromo } from '../domain/promo/FreeTrialPromo';
import { PercentPromo } from '../domain/promo/PercentPromo';
import type { PromoStrategy } from '../domain/promo/PromoStrategy';

export const promoStrategyRegistry: Record<PromoCode['type'], PromoStrategy> = {
  percent: new PercentPromo(),
  fixed_amount: new FixedAmountPromo(),
  free_trial: new FreeTrialPromo(),
};

export function registerPromoStrategy(type: PromoCode['type'], strategy: PromoStrategy): void {
  promoStrategyRegistry[type] = strategy;
}