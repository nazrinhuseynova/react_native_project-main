import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { Invoice } from '../../domain/entities/Invoice';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway';
import type { InvoiceRepository } from '../../repositories/InvoiceRepository';
import { RefundPolicy } from '../../domain/services/RefundPolicy';
import { RequestRefund } from '../../domain/usecases/RequestRefund';
import { MockPaymentGateway } from '../../data/gateways/MockPaymentGateway';

export interface UseInvoicesDeps {
  userId: string;
  repository: InvoiceRepository;
  gateway?: PaymentGateway;
}

export function useInvoices(deps: UseInvoicesDeps) {
  const queryClient = useQueryClient();
  const queryKey = ['invoices', deps.userId];

  const refundUseCase = useMemo(
    () =>
      new RequestRefund(
        deps.gateway ?? new MockPaymentGateway(),
        deps.repository,
        new RefundPolicy(),
      ),
    [deps.gateway, deps.repository],
  );

  const listQuery = useQuery<Invoice[], Error>({
    queryKey,
    queryFn: () => deps.repository.listByUser(deps.userId),
    enabled: Boolean(deps.userId),
  });

  const refundMutation = useMutation<
    Invoice,
    Error,
    { invoice: Invoice; transactionId: string; reason?: string }
  >({
    mutationFn: ({ invoice, transactionId, reason }) =>
      refundUseCase.execute({ invoice, transactionId, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    invoices: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isRefetching: listQuery.isRefetching,
    error: listQuery.error?.message ?? refundMutation.error?.message ?? null,
    refetch: listQuery.refetch,
    requestRefund: refundMutation.mutateAsync,
    isRefunding: refundMutation.isPending,
  };
}