import type { Rental } from '../entities/Rental';
import type { PriceCatalog } from '../policies/PriceCatalog';
import type { RentalRepository } from '../repositories/RentalRepository';

export interface RentTitleInput {
  userId: string;
  titleId: string;
  titleName?: string;
  now?: Date;
}

export class RentTitle {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly priceCatalog: PriceCatalog,
  ) {}

  async execute(input: RentTitleInput): Promise<Rental> {
    const now = input.now ?? new Date();
    const pricing = this.priceCatalog.getPriceForTitle(input.titleId);

    return this.rentalRepository.create({
      userId: input.userId,
      titleId: input.titleId,
      titleName: input.titleName,
      amountCents: pricing.rentAmountCents,
      currency: pricing.currency,
      purchasedAt: now.toISOString(),
      availabilityDays: pricing.availabilityDays,
      playbackHours: pricing.playbackHours,
    });
  }
}