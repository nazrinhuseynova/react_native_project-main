import type { Rental } from '../entities/Rental';
import {
  RentalWindowPolicy,
  type RentalEvaluation,
} from '../policies/RentalWindowPolicy';
import type { PurchaseRepository } from '../repositories/PurchaseRepository';
import type { RentalRepository } from '../repositories/RentalRepository';

export interface TitleAccessStatus {
  hasPermanentPurchase: boolean;
  rental: Rental | null;
  evaluation: RentalEvaluation | null;
  canWatch: boolean;
}

export class GetRentalStatus {
  constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly windowPolicy: RentalWindowPolicy = new RentalWindowPolicy(),
  ) {}

  async execute(
    userId: string,
    titleId: string,
    now: Date = new Date(),
  ): Promise<TitleAccessStatus> {
    const [purchase, rental] = await Promise.all([
      this.purchaseRepository.getByUserAndTitle(userId, titleId),
      this.rentalRepository.getByUserAndTitle(userId, titleId),
    ]);

    if (purchase) {
      return {
        hasPermanentPurchase: true,
        rental,
        evaluation: rental ? this.windowPolicy.evaluate(rental, now) : null,
        canWatch: true,
      };
    }

    if (!rental) {
      return {
        hasPermanentPurchase: false,
        rental: null,
        evaluation: null,
        canWatch: false,
      };
    }

    const evaluation = this.windowPolicy.evaluate(rental, now);

    return {
      hasPermanentPurchase: false,
      rental,
      evaluation,
      canWatch: evaluation.canWatch,
    };
  }
}