import type { Rental } from '../entities/Rental';

export interface CreateRentalInput {
  userId: string;
  titleId: string;
  titleName?: string;
  amountCents: number;
  currency: string;
  purchasedAt: string;
  availabilityDays: number;
  playbackHours: number;
}

export interface RentalRepository {
  getByUserAndTitle(userId: string, titleId: string): Promise<Rental | null>;
  listByUser(userId: string): Promise<Rental[]>;
  create(input: CreateRentalInput): Promise<Rental>;
  markFirstPlay(rentalId: string, firstPlayAt: string): Promise<Rental>;
}