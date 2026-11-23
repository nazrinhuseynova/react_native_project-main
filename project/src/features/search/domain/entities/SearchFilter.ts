import type { MediaKind, Title } from '@/features/catalog';

export type SearchKind = 'all' | MediaKind;

export type SearchFilter = {
  kind: SearchKind;
  genreId: number | null;
  minRating: number;
};

export const DEFAULT_SEARCH_FILTER: SearchFilter = { kind: 'all', genreId: null, minRating: 0 };
export const RATING_STEPS = [0, 6, 7, 8] as const;

export function countActiveFilters(filter: SearchFilter): number {
  return (
    (filter.kind !== 'all' ? 1 : 0) +
    (filter.genreId !== null ? 1 : 0) +
    (filter.minRating > 0 ? 1 : 0)
  );
}

export function matchesFilter(title: Title, filter: SearchFilter): boolean {
  if (filter.kind !== 'all' && title.kind !== filter.kind) return false;
  if (filter.genreId !== null && !title.genreIds.includes(filter.genreId)) return false;
  return title.voteAverage >= filter.minRating;
}