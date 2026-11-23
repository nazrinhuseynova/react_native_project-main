import type { Invoice, InvoiceStatus } from '../domain/entities/Invoice';

export interface CreateInvoiceInput {
  userId: string;
  description: string;
  itemKind: Invoice['itemKind'];
  itemId: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: Invoice['currency'];
  promoCode?: string;
  paymentMethodLast4?: string;
  status: InvoiceStatus;
}

export interface InvoiceRepository {
  listByUser(userId: string): Promise<Invoice[]>;
  create(input: CreateInvoiceInput): Promise<Invoice>;
  updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice>;
}