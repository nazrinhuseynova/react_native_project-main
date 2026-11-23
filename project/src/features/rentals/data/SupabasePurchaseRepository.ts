import type { SupabaseClient } from '@supabase/supabase-js';

import type { Purchase } from '../domain/entities/Purchase';
import type {
  CreatePurchaseInput,
  PurchaseRepository,
} from '../domain/repositories/PurchaseRepository';

interface PurchaseRow {
  id: string;
  user_id: string;
  title_id: string;
  title_name?: string | null;
  amount_cents: number;
  currency: string;
  purchased_at: string;
}

function mapRowToPurchase(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    userId: row.user_id,
    titleId: row.title_id,
    titleName: row.title_name ?? undefined,
    amountCents: row.amount_cents,
    currency: row.currency,
    purchasedAt: row.purchased_at,
  };
}

export class SupabasePurchaseRepository implements PurchaseRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getByUserAndTitle(
    userId: string,
    titleId: string,
  ): Promise<Purchase | null> {
    const { data, error } = await this.client
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapRowToPurchase(data as PurchaseRow) : null;
  }

  async listByUser(userId: string): Promise<Purchase[]> {
    const { data, error } = await this.client
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as PurchaseRow[]).map(mapRowToPurchase);
  }

  async create(input: CreatePurchaseInput): Promise<Purchase> {
    const { data, error } = await this.client
      .from('purchases')
      .insert({
        user_id: input.userId,
        title_id: input.titleId,
        title_name: input.titleName ?? null,
        amount_cents: input.amountCents,
        currency: input.currency,
        purchased_at: input.purchasedAt,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapRowToPurchase(data as PurchaseRow);
  }
}