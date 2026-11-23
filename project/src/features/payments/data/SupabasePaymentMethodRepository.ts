import type { SupabaseClient } from '@supabase/supabase-js';

import type { PaymentMethod } from '../domain/entities/PaymentMethod';
import type {
  CreatePaymentMethodInput,
  PaymentMethodRepository,
} from '../../payments/repositories/PaymentMethodRepository';

interface PaymentMethodRow {
  id: string;
  user_id: string;
  token: string;
  brand: PaymentMethod['brand'];
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
}

function mapRow(row: PaymentMethodRow): PaymentMethod {
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    brand: row.brand,
    last4: row.last4,
    expMonth: row.exp_month,
    expYear: row.exp_year,
    isDefault: row.is_default,
    createdAt: row.created_at,
  };
}

export class SupabasePaymentMethodRepository implements PaymentMethodRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listByUser(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await this.client
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return ((data ?? []) as PaymentMethodRow[]).map(mapRow);
  }

  async add(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
    if (input.setAsDefault) {
      await this.client
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', input.userId);
    }

    const { data, error } = await this.client
      .from('payment_methods')
      .insert({
        user_id: input.userId,
        token: input.token,
        brand: input.brand,
        last4: input.last4,
        exp_month: input.expMonth,
        exp_year: input.expYear,
        is_default: input.setAsDefault ?? false,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return mapRow(data as PaymentMethodRow);
  }

  async setDefault(userId: string, paymentMethodId: string): Promise<void> {
    await this.client
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    const { error } = await this.client
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  async remove(userId: string, paymentMethodId: string): Promise<void> {
    const { error } = await this.client
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}