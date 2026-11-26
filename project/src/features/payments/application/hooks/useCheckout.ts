import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { Invoice } from '../../domain/entities/Invoice';
import type { Money } from '../../domain/entities/Money';
import type { PaymentMethod } from '../../domain/entities/PaymentMethod';
import { Charge, type ChargeOutcome } from '../../domain/usecases/Charge';
import { MockPaymentGateway } from '../../data/gateways/MockPaymentGateway';

export interface UseCheckoutDeps {
  userId: string;
  invoiceRepo: Charge['invoiceRepo'];
  gateway?: Charge['gateway'];
}

export interface CheckoutInput {
  paymentMethod: PaymentMethod;
  subtotal: Money;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
}

export function useCheckout(deps: UseCheckoutDeps) {
  const queryClient = useQueryClient();

  const chargeUseCase = useMemo(() => {
    const gateway = deps.gateway ?? new MockPaymentGateway();
    return new Charge(gateway, deps.invoiceRepo);
  }, [deps.gateway, deps.invoiceRepo]);

  const mutation = useMutation<ChargeOutcome, Error, CheckoutInput>({
    mutationFn: (input) =>
      chargeUseCase.execute({
        userId: deps.userId,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        description: input.description,
        itemKind: input.itemKind,
        itemId: input.itemId,
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