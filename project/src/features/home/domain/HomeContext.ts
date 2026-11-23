import type { DiscoverRepository, TitleId, TitleRepository } from '@/features/catalog';

import type { CategoryFilter } from './CategoryFilter';

export type ContinueWatchingItem = {
  titleId: TitleId;
  progress: number;
};


export interface HomeHistorySource {
  continueWatching(profileId: string): Promise<ContinueWatchingItem[]>;
  recentlyWatched(profileId: string): Promise<TitleId[]>;
}


export interface HomeLibrarySource {
  savedTitleIds(profileId: string): Promise<TitleId[]>;
}

export type HomeSources = {
  history: HomeHistorySource;
  library: HomeLibrarySource;
};

export type HomeContext = {
  profile: { id: string; isKids: boolean };
  language: string;
  country: string | null;
  category: CategoryFilter;
  preferredGenreIds: readonly number[];
  genreNames: Readonly<Record<number, string>>;
  discover: DiscoverRepository;
  titles: TitleRepository;
  sources: HomeSources;
};