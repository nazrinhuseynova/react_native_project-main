import type { Purchase } from '../entities/Purchase';
import type { PriceCatalog } from '../policies/PriceCatalog';
import type { PurchaseRepository } from '../repositories/PurchaseRepository';

export interface BuyTitleInput {
  userId: string;
  titleId: string;
  titleName?: string;
  now?: Date;
}

export class BuyTitle {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly priceCatalog: PriceCatalog,
  ) {}

  async execute(input: BuyTitleInput): Promise<Purchase> {
    const existing = await this.purchaseRepository.getByUserAndTitle(
      input.userId,
      input.titleId,
    );
    if (existing) {
      return existing;
    }

    const now = input.now ?? new Date();
    const pricing = this.priceCatalog.getPriceForTitle(input.titleId);

    return this.purchaseRepository.create({
      userId: input.userId,
      titleId: input.titleId,
      titleName: input.titleName,
      amountCents: pricing.buyAmountCents,
      currency: pricing.currency,
      purchasedAt: now.toISOString(),
    });
  }
}