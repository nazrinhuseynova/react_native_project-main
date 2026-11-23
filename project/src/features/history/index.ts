export { WatchedScreen } from './presentation/screens/WatchedScreen';

export { WatchedBadge } from './presentation/components/WatchedBadge';
export { useContinueWatching } from './application/hooks/useContinueWatching';
export { useWatchedTitles } from './application/hooks/useWatchedTitles';
export type { WatchedItem } from './application/hooks/useWatchedTitles';
export { useTitleProgress } from './application/hooks/useTitleProgress';
export { useClearHistory } from './application/hooks/useClearHistory';
export { historyKeys } from './application/historyKey';

export { progressFraction } from './domain/entities/WatchProgress';
export type { WatchProgress } from './domain/entities/WatchProgress';
export type { HistoryRepository } from './domain/repositories/HistoryRepository';

// ── container.ts / registerModules.ts üçün ──
export { startHistoryListener } from './application/historyEventListener';
export { SupabaseHistoryRepository } from './data/SupabaseHistoryRepository';
export { LocalProgressBuffer } from './data/LocalProgressBuffer';
export { CompletionPolicy } from './domain/policies/CompletionPolicy';
export { ContinueWatchingSelector } from './domain/services/ContinueWatchingSelector';
export { SaveProgress } from './domain/usecases/SaveProgress';
export { GetContinueWatching } from './domain/usecases/GetContinueWatching';
export { GetWatched } from './domain/usecases/GetWatched';
export { RemoveFromHistory } from './domain/usecases/RemoveFromHistory';
export { ClearHistory } from './domain/usecases/ClearHistory';