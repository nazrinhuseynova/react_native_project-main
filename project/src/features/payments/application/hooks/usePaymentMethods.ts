import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { PaymentMethod } from '../../domain/entities/PaymentMethod';
import type { PaymentGateway } from '../../domain/ports/PaymentGateway';
import type { PaymentMethodRepository } from '../../repositories/PaymentMethodRepository';
import { AddPaymentMethod } from '../../domain/usecases/AddPaymentMethod';
import { RemovePaymentMethod } from '../../domain/usecases/RemovePaymentMethod';
import { MockPaymentGateway } from '../../data/gateways/MockPaymentGateway';
import type { CardFormValues } from '../schemas/cardSchema';

export interface UsePaymentMethodsDeps {
  userId: string;
  repository: PaymentMethodRepository;
  gateway?: PaymentGateway;
}

export function usePaymentMethods(deps: UsePaymentMethodsDeps) {
  const queryClient = useQueryClient();
  const queryKey = ['paymentMethods', deps.userId];

  const addUseCase = useMemo(
    () => new AddPaymentMethod(deps.gateway ?? new MockPaymentGateway(), deps.repository),
    [deps.gateway, deps.repository],
  );

  const removeUseCase = useMemo(
    () => new RemovePaymentMethod(deps.repository),
    [deps.repository],
  );

  const listQuery = useQuery<PaymentMethod[], Error>({
    queryKey,
    queryFn: () => deps.repository.listByUser(deps.userId),
    enabled: Boolean(deps.userId),
  });

  const addMutation = useMutation<PaymentMethod, Error, CardFormValues>({
    mutationFn: (values) =>
      addUseCase.execute({
        userId: deps.userId,
        cardholderName: values.cardholderName,
        cardNumber: values.cardNumber,
        expMonth: values.expMonth,
        expYear: values.expYear,
        cvc: values.cvc,
        setAsDefault: values.setAsDefault,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation<void, Error, string>({
    mutationFn: (paymentMethodId) =>
      removeUseCase.execute({ userId: deps.userId, paymentMethodId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const setDefaultMutation = useMutation<void, Error, string>({
    mutationFn: (paymentMethodId) => deps.repository.setDefault(deps.userId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    paymentMethods: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error?.message ?? addMutation.error?.message ?? null,
    refetch: listQuery.refetch,
    addCard: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    removeCard: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    setDefaultCard: setDefaultMutation.mutateAsync,
  };
}