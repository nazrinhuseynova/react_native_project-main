import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { Invoice } from '../../domain/entities/Invoice';
import type { Money } from '../../domain/entities/Money';
import type { PaymentMethod } from '../../domain/entities/PaymentMethod';
import type { PromoCode } from '../../domain/entities/PromoCode';
import { PricingService } from '../../domain/services/PricingService';
import { Charge, type ChargeOutcome } from '../../domain/usecases/Charge';
import { MockPaymentGateway } from '../../data/gateways/MockPaymentGateway';
import { promoStrategyRegistry } from '../promoRegistry';

export interface UseCheckoutDeps {
  userId: string;
  invoiceRepo: Charge['invoiceRepo'];
  promoRepo: Charge['promoRepo'];
  gateway?: Charge['gateway'];
}

export interface CheckoutInput {
  paymentMethod: PaymentMethod;
  subtotal: Money;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
  promoCode?: PromoCode | null;
}

export function useCheckout(deps: UseCheckoutDeps) {
  const queryClient = useQueryClient();

  const chargeUseCase = useMemo(() => {
    const gateway = deps.gateway ?? new MockPaymentGateway();
    const pricingService = new PricingService(promoStrategyRegistry);
    return new Charge(gateway, deps.invoiceRepo, deps.promoRepo, pricingService);
  }, [deps.gateway, deps.invoiceRepo, deps.promoRepo]);

  const mutation = useMutation<ChargeOutcome, Error, CheckoutInput>({
    mutationFn: (input) =>
      chargeUseCase.execute({
        userId: deps.userId,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        description: input.description,
        itemKind: input.itemKind,
        itemId: input.itemId,
        promoCode: input.promoCode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', deps.userId] });
    },
  });

  return {
    checkout: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error?.message ?? null,
    isLoading: mutation.isPending,
    reset: mutation.reset,
  };
}