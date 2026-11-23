import type { SupabaseClient } from '@supabase/supabase-js';

import type { Invoice, InvoiceStatus } from '../domain/entities/Invoice';
import type {
  CreateInvoiceInput,
  InvoiceRepository,
} from '../../payments/repositories/InvoiceRepository';

interface InvoiceRow {
  id: string;
  user_id: string;
  description: string;
  item_kind: Invoice['itemKind'];
  item_id: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: Invoice['currency'];
  promo_code: string | null;
  payment_method_last4: string | null;
  status: InvoiceStatus;
  created_at: string;
}

function mapInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    userId: row.user_id,
    description: row.description,
    itemKind: row.item_kind,
    itemId: row.item_id,
    subtotalAmount: row.subtotal_amount,
    discountAmount: row.discount_amount,
    totalAmount: row.total_amount,
    currency: row.currency,
    promoCode: row.promo_code ?? undefined,
    paymentMethodLast4: row.payment_method_last4 ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export class SupabaseInvoiceRepository implements InvoiceRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listByUser(userId: string): Promise<Invoice[]> {
    const { data, error } = await this.client
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return ((data ?? []) as InvoiceRow[]).map(mapInvoice);
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const { data, error } = await this.client
      .from('invoices')
      .insert({
        user_id: input.userId,
        description: input.description,
        item_kind: input.itemKind,
        item_id: input.itemId,
        subtotal_amount: input.subtotalAmount,
        discount_amount: input.discountAmount,
        total_amount: input.totalAmount,
        currency: input.currency,
        promo_code: input.promoCode ?? null,
        payment_method_last4: input.paymentMethodLast4 ?? null,
        status: input.status,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return mapInvoice(data as InvoiceRow);
  }

  async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice> {
    const { data, error } = await this.client
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return mapInvoice(data as InvoiceRow);
  }
}