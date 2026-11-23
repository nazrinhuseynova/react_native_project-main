import type { CurrencyCode } from './Money';

export type PromoType = 'percent' | 'fixed_amount' | 'free_trial';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number; 
  currency?: CurrencyCode;
  expiresAt?: string;
  maxRedemptions?: number;
  redeemedCount: number;
  active: boolean;
}