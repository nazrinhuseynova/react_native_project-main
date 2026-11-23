export const WATCH_STATUSES = ['planned', 'watching', 'completed'] as const;

export type WatchStatus = (typeof WATCH_STATUSES)[number];

export const DEFAULT_WATCH_STATUS: WatchStatus = 'planned';

export function isWatchStatus(value: unknown): value is WatchStatus {
  return typeof value === 'string' && (WATCH_STATUSES as readonly string[]).includes(value);
}