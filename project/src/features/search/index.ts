export { SearchScreen } from './presentation/screens/SearchScreen';

export { useSearch } from './application/hooks/useSearch';
export { useRecentSearches } from './application/hooks/useRecentSearches';
export { useTopSearches } from './application/hooks/useTopSearches';
export { useSearchFilters } from './application/hooks/useSearchFilters';
export { searchKeys } from './application/searchKeys';

export type { SearchFilter, SearchKind } from './domain/entities/SearchFilter';
export type { PersonResult, SearchResults } from './domain/entities/SearchResult';
export type { SearchRepository } from './domain/repositories/SearchRepository';
export type { RecentSearchRepository } from './domain/repositories/RecentSearchRepository';
export type { SearchStrategy } from './domain/strategies/SearchStrategy';

// ── container.ts üçün ──
export { SearchOrchestrator } from './domain/services/SearchOrchestrator';
export { createSearchStrategyRegistry } from './application/searchStrategyRegistry';
export { TmdbSearchRepository } from './data/TmdbSearchRepository';
export { AsyncRecentSearchRepository } from './data/AsyncRecentSearchRepository';