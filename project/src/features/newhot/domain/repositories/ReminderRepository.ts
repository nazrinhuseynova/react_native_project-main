import type { TitleId } from '@/features/catalog';

import type { NewReminder, Reminder } from '../entities/Reminder';

export interface ReminderRepository {
  list(): Promise<Reminder[]>;
  find(titleId: TitleId): Promise<Reminder | null>;
  add(input: NewReminder): Promise<Reminder>;
  remove(titleId: TitleId): Promise<void>;
}