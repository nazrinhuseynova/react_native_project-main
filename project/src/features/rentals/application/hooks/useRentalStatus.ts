import { useCallback, useEffect, useState } from 'react';

import type { PurchaseRepository } from '../../domain/repositories/PurchaseRepository';
import type { RentalRepository } from '../../domain/repositories/RentalRepository';
import {
  GetRentalStatus,
  type TitleAccessStatus,
} from '../../domain/usercases/GetRentalStatus';

export interface UseRentalStatusParams {
  userId: string;
  titleId: string;
  rentalRepository: RentalRepository;
  purchaseRepository: PurchaseRepository;
}

export function useRentalStatus({
  userId,
  titleId,
  rentalRepository,
  purchaseRepository,
}: UseRentalStatusParams) {
  const [status, setStatus] = useState<TitleAccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId || !titleId) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const useCase = new GetRentalStatus(rentalRepository, purchaseRepository);
      const result = await useCase.execute(userId, titleId);
      setStatus(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Kirayə statusu yüklənə bilmədi',
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, titleId, rentalRepository, purchaseRepository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    status,
    canWatch: status?.canWatch ?? false,
    hasPermanentPurchase: status?.hasPermanentPurchase ?? false,
    rental: status?.rental ?? null,
    evaluation: status?.evaluation ?? null,
    isLoading,
    error,
    refresh,
  };
}