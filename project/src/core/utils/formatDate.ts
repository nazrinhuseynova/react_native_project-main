export type DateInput = Date | string | number;

export type DateStyle = 'short' | 'medium' | 'long';

export function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: DateInput, locale = 'en', style: DateStyle = 'medium'): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '';

  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function formatDateTime(value: DateInput, locale = 'en'): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '';

  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      date,
    );
  } catch {
    return date.toLocaleString();
  }
}

export function formatYear(value: DateInput): string {
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? '' : String(date.getFullYear());
}