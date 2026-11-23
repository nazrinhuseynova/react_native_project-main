export { HomeScreen } from './presentation/screens/HomeScreen';
export { KidsHomeScreen } from './presentation/screens/KidsHomeScreen';

export { useCategoryFilter } from './application/hooks/useCategoryFilter';
export { useHeroTitle } from './application/hooks/useHeroTitle';
export { useHomeRows } from './application/hooks/useHomeRows';

export type {
  CategoryFilter,
  CategoryKind,
} from './domain/CategoryFilter';
export type {
  ContinueWatchingItem,
  HomeContext,
  HomeHistorySource,
  HomeLibrarySource,
  HomeSources,
} from './domain/HomeContext';
export type { HomeEntry, HomeRow, HomeRowResult } from './domain/HomeRow';

// ── container.ts üçün ──
export { createHomeRowRegistry } from './application/homeRowRegistry';
export { emptyHomeSources } from './data/EmptyHomeSources';