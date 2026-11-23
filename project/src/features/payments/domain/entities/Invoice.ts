import type { CurrencyCode } from './Money';

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type BillingItemKind = 'subscription' | 'rental' | 'purchase';

export interface Invoice {
  id: string;
  userId: string;
  description: string;
  itemKind: BillingItemKind;
  itemId: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
  promoCode?: string;
  paymentMethodLast4?: string;
  status: InvoiceStatus;
  createdAt: string;
}