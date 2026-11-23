import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import type { Money } from '../../domain/entities/Money';
import type { PromoCode } from '../../domain/entities/PromoCode';
import type { PromoRepository } from '../../repositories/PromoRepository';
import { PricingService, type PriceBreakdown } from '../../domain/services/PricingService';
import { ApplyPromo, type ApplyPromoResult } from '../../domain/usecases/ApplyPromo';
import { promoStrategyRegistry } from '../promoRegistry';

export function usePromo(promoRepo: PromoRepository) {
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

  const pricingService = useMemo(() => new PricingService(promoStrategyRegistry), []);
  const applyUseCase = useMemo(
    () => new ApplyPromo(promoRepo, pricingService),
    [promoRepo, pricingService],
  );

  const mutation = useMutation<ApplyPromoResult, Error, { code: string; subtotal: Money }>({
    mutationFn: ({ code, subtotal }) => applyUseCase.execute({ code, subtotal }),
    onSuccess: (res) => {
      setAppliedPromo(res.promo);
      setBreakdown(res.breakdown);
    },
  });

  const clearPromo = () => {
    setAppliedPromo(null);
    setBreakdown(null);
    mutation.reset();
  };

  return {
    appliedPromo,
    breakdown,
    applyPromo: mutation.mutateAsync,
    clearPromo,
    isApplying: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}