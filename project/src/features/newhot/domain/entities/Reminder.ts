import type { TitleId } from '@/features/catalog';

export type Reminder = {
  id: string;
  titleId: TitleId;
  titleName: string;
  posterUrl: string | null;
  releaseDate: string;
  remindAt: string;
  notificationId: string | null;
  createdAt: string;
};

export type NewReminder = Omit<Reminder, 'id' | 'createdAt'>;

export type ReminderTarget = {
  titleId: TitleId;
  titleName: string;
  posterUrl: string | null;
  releaseDate: string | null;
};

export const REMINDER_HOUR = 9;

function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
export function computeRemindAt(releaseDate: string | null, now: Date = new Date()): Date | null {
  if (!releaseDate) return null;
  const release = parseLocalDate(releaseDate);
  if (!release) return null;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (release.getTime() <= today.getTime()) return null;

  release.setHours(REMINDER_HOUR, 0, 0, 0);
  return release;
}

export function reminderNotificationId(titleId: TitleId): string {
  return `reminder:${titleId}`;
}