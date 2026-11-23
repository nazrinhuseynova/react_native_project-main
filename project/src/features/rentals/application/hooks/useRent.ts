import { useCallback, useState } from 'react';

import type { Rental } from '../../domain/entities/Rental';
import { PriceCatalog } from '../../domain/policies/PriceCatalog';
import type { RentalRepository } from '../../domain/repositories/RentalRepository';
import { RentTitle } from '../../domain/usercases/RentTitle';

export interface UseRentParams {
  userId: string;
  rentalRepository: RentalRepository;
  priceCatalog?: PriceCatalog;
  onSuccess?: (rental: Rental) => void;
}

export function useRent({
  userId,
  rentalRepository,
  priceCatalog = new PriceCatalog(),
  onSuccess,
}: UseRentParams) {
  const [isRenting, setIsRenting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rental, setRental] = useState<Rental | null>(null);

  const rentTitle = useCallback(
    async (titleId: string, titleName?: string) => {
      setIsRenting(true);
      setError(null);
      try {
        const useCase = new RentTitle(rentalRepository, priceCatalog);
        const created = await useCase.execute({ userId, titleId, titleName });
        setRental(created);
        onSuccess?.(created);
        return created;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Kirayə əməliyyatı uğursuz oldu';
        setError(message);
        return null;
      } finally {
        setIsRenting(false);
      }
    },
    [userId, rentalRepository, priceCatalog, onSuccess],
  );

  return {
    rentTitle,
    rental,
    isRenting,
    error,
  };
}