import type { SupabaseClient } from '@supabase/supabase-js';

import type { PromoCode } from '../domain/entities/PromoCode';
import type { PromoRepository } from '../../payments/repositories/PromoRepository';

interface PromoRow {
  id: string;
  code: string;
  type: PromoCode['type'];
  value: number;
  currency: PromoCode['currency'] | null;
  expires_at: string | null;
  max_redemptions: number | null;
  redeemed_count: number;
  active: boolean;
}

function mapPromo(row: PromoRow): PromoCode {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    currency: row.currency ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    maxRedemptions: row.max_redemptions ?? undefined,
    redeemedCount: row.redeemed_count,
    active: row.active,
  };
}

export class SupabasePromoRepository implements PromoRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByCode(code: string): Promise<PromoCode | null> {
    const { data, error } = await this.client
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return mapPromo(data as PromoRow);
  }

  async incrementRedemption(promoId: string): Promise<void> {
    const { data, error: fetchError } = await this.client
      .from('promo_codes')
      .select('redeemed_count')
      .eq('id', promoId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const nextCount = ((data as { redeemed_count: number } | null)?.redeemed_count ?? 0) + 1;
    const { error } = await this.client
      .from('promo_codes')
      .update({ redeemed_count: nextCount })
      .eq('id', promoId);

    if (error) throw new Error(error.message);
  }
}