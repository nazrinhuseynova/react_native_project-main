import type { SupabaseClient } from '@supabase/supabase-js';
import type { CurrencyCode } from '@/core/utils/formatMoney';

import { DEFAULT_PLANS, type Plan, type VideoQuality } from '../domain/entities/Plan';
import type { PlanRepository } from '../domain/repositories/PlanRepository';

type PlanRow = {
  id: string;
  name: string;
  price_minor: number;
  currency: string;
  quality: string;
  max_screens: number;
  downloads_allowed: boolean;
  has_ads: boolean;
  is_popular: boolean | null;
  sort_order: number;
};

function toPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    name: row.name,
    priceMinor: row.price_minor,
    currency: (row.currency || 'AZN') as CurrencyCode,
    quality: (row.quality || '1080p') as VideoQuality,
    maxScreens: row.max_screens ?? 1,
    downloadsAllowed: Boolean(row.downloads_allowed),
    hasAds: Boolean(row.has_ads),
    isPopular: Boolean(row.is_popular),
    sortOrder: row.sort_order ?? 0,
  };
}

export class SupabasePlanRepository implements PlanRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<Plan[]> {
    const { data, error } = await this.client
      .from('plans')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...DEFAULT_PLANS];
    }

    return (data as PlanRow[]).map(toPlan);
  }

  async getById(planId: string): Promise<Plan | null> {
    const all = await this.list();
    return all.find((plan) => plan.id === planId) ?? null;
  }
}
