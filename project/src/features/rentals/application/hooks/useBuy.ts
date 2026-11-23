import { useCallback, useState } from 'react';

import type { Purchase } from '../../domain/entities/Purchase';
import { PriceCatalog } from '../../domain/policies/PriceCatalog';
import type { PurchaseRepository } from '../../domain/repositories/PurchaseRepository';
import { BuyTitle } from '../../domain/usercases/BuyTitle';

export interface UseBuyParams {
  userId: string;
  purchaseRepository: PurchaseRepository;
  priceCatalog?: PriceCatalog;
  onSuccess?: (purchase: Purchase) => void;
}

export function useBuy({
  userId,
  purchaseRepository,
  priceCatalog = new PriceCatalog(),
  onSuccess,
}: UseBuyParams) {
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);

  const buyTitle = useCallback(
    async (titleId: string, titleName?: string) => {
      setIsBuying(true);
      setError(null);
      try {
        const useCase = new BuyTitle(purchaseRepository, priceCatalog);
        const created = await useCase.execute({ userId, titleId, titleName });
        setPurchase(created);
        onSuccess?.(created);
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Satın alma uğursuz oldu';
        setError(message);
        return null;
      } finally {
        setIsBuying(false);
      }
    },
    [userId, purchaseRepository, priceCatalog, onSuccess],
  );

  return {
    buyTitle,
    purchase,
    isBuying,
    error,
  };
}