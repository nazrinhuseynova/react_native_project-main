import type { PromoCode } from '../domain/entities/PromoCode';

export interface PromoRepository {
  findByCode(code: string): Promise<PromoCode | null>;
  incrementRedemption(promoId: string): Promise<void>;
}