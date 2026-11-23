export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

export interface PaymentMethod {
  id: string;
  userId: string;
  token: string; 
  brand: CardBrand;
  last4: string;
  expMonth: number; 
  expYear: number; 
  isDefault: boolean;
  createdAt: string;
}