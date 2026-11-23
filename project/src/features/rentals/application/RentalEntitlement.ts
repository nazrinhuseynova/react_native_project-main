import { GetRentalStatus } from '../domain/usercases/GetRentalStatus';
import type { PurchaseRepository } from '../domain/repositories/PurchaseRepository';
import type { RentalRepository } from '../domain/repositories/RentalRepository';

export interface EntitlementCheckInput {
  userId: string;
  titleId: string;
}

export class RentalEntitlement {
  private readonly getRentalStatus: GetRentalStatus;

  constructor(
    rentalRepository: RentalRepository,
    purchaseRepository: PurchaseRepository,
  ) {
    this.getRentalStatus = new GetRentalStatus(
      rentalRepository,
      purchaseRepository,
    );
  }

  async canPlay(input: EntitlementCheckInput): Promise<boolean> {
    const status = await this.getRentalStatus.execute(input.userId, input.titleId);
    return status.canWatch;
  }
}