import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { TitleId } from '@/features/catalog';

import type { NewReminder, Reminder } from '../domain/entities/Reminder';
import type { ReminderRepository } from '../domain/repositories/ReminderRepository';

const TABLE = 'reminders';
const COLUMNS =
  'id, title_id, title_name, poster_url, release_date, remind_at, notification_id, created_at';

type ReminderRow = {
  id: string;
  title_id: string;
  title_name: string;
  poster_url: string | null;
  release_date: string;
  remind_at: string;
  notification_id: string | null;
  created_at: string;
};

function toReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    titleId: row.title_id as TitleId,
    titleName: row.title_name,
    posterUrl: row.poster_url,
    releaseDate: row.release_date,
    remindAt: row.remind_at,
    notificationId: row.notification_id,
    createdAt: row.created_at,
  };
}

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'REMINDER', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseReminderRepository implements ReminderRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async list(): Promise<Reminder[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .order('remind_at', { ascending: true });
    if (error) throw toError('Failed to load reminders', error);
    return ((data ?? []) as ReminderRow[]).map(toReminder);
  }

  async find(titleId: TitleId): Promise<Reminder | null> {
    const { data, error } = await this.client
      .from(TABLE)
      .select(COLUMNS)
      .eq('title_id', titleId)
      .maybeSingle();
    if (error) throw toError('Failed to load reminder', error);
    return data ? toReminder(data as ReminderRow) : null;
  }

  async add(input: NewReminder): Promise<Reminder> {
    const { data, error } = await this.client
      .from(TABLE)
      .upsert(
        {
          title_id: input.titleId,
          title_name: input.titleName,
          poster_url: input.posterUrl,
          release_date: input.releaseDate,
          remind_at: input.remindAt,
          notification_id: input.notificationId,
        },
        { onConflict: 'user_id,title_id' },
      )
      .select(COLUMNS)
      .single();
    if (error) throw toError('Failed to save reminder', error);
    return toReminder(data as ReminderRow);
  }

  async remove(titleId: TitleId): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('title_id', titleId);
    if (error) throw toError('Failed to delete reminder', error);
  }
}