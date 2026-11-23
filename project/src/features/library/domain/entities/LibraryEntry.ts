import type { Title, TitleId } from '@/features/catalog';

import { DEFAULT_WATCH_STATUS, type WatchStatus } from './WatchStatus';

export type LibraryEntry = {
  titleId: TitleId;
  saved: boolean;
  favorite: boolean;
  watchStatus: WatchStatus;
  addedAt: string;
};

export type EntryPatch = Partial<Pick<LibraryEntry, 'saved' | 'favorite' | 'watchStatus'>>;

export type LibraryItem = {
  entry: LibraryEntry;
  title: Title;
};

export type LibraryTab = 'saved' | 'favorites';

export function createEntry(titleId: TitleId, now: Date = new Date()): LibraryEntry {
  return {
    titleId,
    saved: false,
    favorite: false,
    watchStatus: DEFAULT_WATCH_STATUS,
    addedAt: now.toISOString(),
  };
}

export function patchEntry(
  entry: LibraryEntry | null,
  titleId: TitleId,
  patch: EntryPatch,
): LibraryEntry {
  return { ...(entry ?? createEntry(titleId)), ...patch };
}

export function isRemovable(entry: LibraryEntry): boolean {
  return !entry.saved && !entry.favorite && entry.watchStatus === DEFAULT_WATCH_STATUS;
}

export function patchEntries(
  entries: readonly LibraryEntry[],
  titleId: TitleId,
  patch: EntryPatch,
): LibraryEntry[] {
  const existing = entries.find((entry) => entry.titleId === titleId) ?? null;
  const next = patchEntry(existing, titleId, patch);
  const others = entries.filter((entry) => entry.titleId !== titleId);
  return isRemovable(next) ? others : [next, ...others];
}