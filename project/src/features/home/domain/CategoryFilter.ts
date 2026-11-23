import type { MediaKind } from '@/features/catalog';

export type CategoryKind = 'all' | 'movie' | 'tv' | 'genre';

export type CategoryFilter =
  | { kind: 'all' }
  | { kind: 'movie' }
  | { kind: 'tv' }
  | { kind: 'genre'; genreId: number };

export const ALL_CATEGORY: CategoryFilter = { kind: 'all' };

export function categoryKey(filter: CategoryFilter): string {
  return filter.kind === 'genre' ? `genre:${filter.genreId}` : filter.kind;
}

export function isSameCategory(a: CategoryFilter, b: CategoryFilter): boolean {
  return categoryKey(a) === categoryKey(b);
}

export function mediaKindOf(filter: CategoryFilter): MediaKind | null {
  return filter.kind === 'movie' || filter.kind === 'tv' ? filter.kind : null;
}