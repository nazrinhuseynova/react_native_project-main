export { WatchlistScreen } from './presentation/screens/WatchlistScreen';

export { SaveButton } from './presentation/components/SaveButton';
export { FavoriteButton } from './presentation/components/FavoriteButton';
export { StatusPicker } from './presentation/components/StatusPicker';

export { useLibrary } from './application/hooks/useLibrary';
export { useToggleSaved } from './application/hooks/useToggleSaved';
export { useToggleFavorite } from './application/hooks/useToggleFavorite';
export { useWatchStatus } from './application/hooks/useWatchStatus';
export { useLibraryQuery } from './application/hooks/useLibraryQuery';
export { libraryKeys } from './application/libraryKeys';

export type { LibraryEntry, LibraryItem, LibraryTab } from './domain/entities/LibraryEntry';
export type { WatchStatus } from './domain/entities/WatchStatus';
export { WATCH_STATUSES } from './domain/entities/WatchStatus';
export type { LibraryRepository } from './domain/repositories/LibraryRepository';
export type { LibrarySorter } from './domain/sorters/LibrarySorter';
export type { LibraryFilter } from './domain/filters/LibraryFilter';


export { SupabaseLibraryRepository } from './data/SupabaseLibraryRepository';
export { ToggleSaved } from './domain/usecases/ToggleSaved';
export { ToggleFavorite } from './domain/usecases/ToggleFavorite';
export { SetWatchStatus } from './domain/usecases/SetWatchStatus';
export { QueryLibrary } from './domain/usecases/QueryLibrary';
export { createLibrarySortRegistry } from './application/librarySortRegistry';
export { createLibraryFilterRegistry } from './application/libraryFilterRegistry';