import type { RegistryItem } from '@/core/registry/Registry';

import type { SearchFilter } from '../entities/SearchFilter';
import type { SearchPartial } from '../entities/SearchResult';
import type { NormalizedQuery } from '../services/normalizeQuery';

export type SearchRequest = {
  query: NormalizedQuery;
  filter: SearchFilter;
};

export interface SearchStrategy extends RegistryItem {
  search(request: SearchRequest): Promise<SearchPartial>;
}