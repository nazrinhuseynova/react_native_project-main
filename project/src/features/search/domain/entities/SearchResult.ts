import type { Artwork, Title } from '@/features/catalog';

export type PersonResult = {
  id: number;
  name: string;
  department: string | null;
  profile: Artwork | null;
  knownFor: Title[];
};

export type SearchPartial = {
  titles: Title[];
  people: PersonResult[];
};

export type SearchResults = SearchPartial;

export const EMPTY_SEARCH_RESULTS: SearchResults = { titles: [], people: [] };

export function hasResults(results: SearchResults): boolean {
  return results.titles.length > 0 || results.people.length > 0;
}