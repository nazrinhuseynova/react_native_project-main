import type { Purchase } from '../entities/Purchase';

export interface CreatePurchaseInput {
  userId: string;
  titleId: string;
  titleName?: string;
  amountCents: number;
  currency: string;
  purchasedAt: string;
}

export interface PurchaseRepository {
  getByUserAndTitle(userId: string, titleId: string): Promise<Purchase | null>;
  listByUser(userId: string): Promise<Purchase[]>;
  create(input: CreatePurchaseInput): Promise<Purchase>;
}