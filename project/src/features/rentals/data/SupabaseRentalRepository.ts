import type { SupabaseClient } from '@supabase/supabase-js';

import type { Rental } from '../domain/entities/Rental';
import type {
  CreateRentalInput,
  RentalRepository,
} from '../domain/repositories/RentalRepository';

interface RentalRow {
  id: string;
  user_id: string;
  title_id: string;
  title_name?: string | null;
  amount_cents: number;
  currency: string;
  purchased_at: string;
  first_play_at: string | null;
  availability_days?: number | null;
  playback_hours?: number | null;
}

function mapRowToRental(row: RentalRow): Rental {
  return {
    id: row.id,
    userId: row.user_id,
    titleId: row.title_id,
    titleName: row.title_name ?? undefined,
    amountCents: row.amount_cents,
    currency: row.currency,
    purchasedAt: row.purchased_at,
    firstPlayAt: row.first_play_at,
    availabilityDays: row.availability_days ?? 30,
    playbackHours: row.playback_hours ?? 48,
  };
}

export class SupabaseRentalRepository implements RentalRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getByUserAndTitle(userId: string, titleId: string): Promise<Rental | null> {
    const { data, error } = await this.client
      .from('rentals')
      .select('*')
      .eq('user_id', userId)
      .eq('title_id', titleId)
      .order('purchased_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapRowToRental(data as RentalRow) : null;
  }

  async listByUser(userId: string): Promise<Rental[]> {
    const { data, error } = await this.client
      .from('rentals')
      .select('*')
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as RentalRow[]).map(mapRowToRental);
  }

  async create(input: CreateRentalInput): Promise<Rental> {
    const { data, error } = await this.client
      .from('rentals')
      .insert({
        user_id: input.userId,
        title_id: input.titleId,
        title_name: input.titleName ?? null,
        amount_cents: input.amountCents,
        currency: input.currency,
        purchased_at: input.purchasedAt,
        first_play_at: null,
        availability_days: input.availabilityDays,
        playback_hours: input.playbackHours,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapRowToRental(data as RentalRow);
  }

  async markFirstPlay(rentalId: string, firstPlayAt: string): Promise<Rental> {
    const { data, error } = await this.client
      .from('rentals')
      .update({ first_play_at: firstPlayAt })
      .eq('id', rentalId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapRowToRental(data as RentalRow);
  }
}