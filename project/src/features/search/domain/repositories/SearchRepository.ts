import type { Title } from '@/features/catalog';

import type { SearchKind } from '../entities/SearchFilter';
import type { PersonResult } from '../entities/SearchResult';

export interface SearchRepository {
  titles(query: string, kind: SearchKind): Promise<Title[]>;
  people(query: string): Promise<PersonResult[]>;
}