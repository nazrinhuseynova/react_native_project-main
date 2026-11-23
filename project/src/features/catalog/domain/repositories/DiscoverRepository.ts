import { assertNever } from '@/core/utils/assertNever';
import type { Paginated } from '@/shared/types/common';

import type { Title } from '../entities/Title';
import type { MediaKind } from '../entities/TitleId';

export type DiscoverKind = MediaKind | 'all';
export type TrendingWindow = 'day' | 'week';

export type GenreOptions = {
  /** Kids profili üçün server tərəfində yaş filtri. */
  kidsOnly?: boolean;
};

export interface DiscoverRepository {
  trending(kind: DiscoverKind, window: TrendingWindow, page?: number): Promise<Paginated<Title>>;
  popular(kind: MediaKind, page?: number): Promise<Paginated<Title>>;
  topRated(kind: MediaKind, page?: number): Promise<Paginated<Title>>;
  upcoming(kind: MediaKind, page?: number): Promise<Paginated<Title>>;
  nowPlaying(page?: number): Promise<Paginated<Title>>;
  onTheAir(page?: number): Promise<Paginated<Title>>;
  byGenre(
    kind: MediaKind,
    genreId: number,
    page?: number,
    options?: GenreOptions,
  ): Promise<Paginated<Title>>;

  kidsSafe(kind: MediaKind, page?: number): Promise<Paginated<Title>>;
}

export type DiscoverQuery =
  | { type: 'trending'; kind: DiscoverKind; window: TrendingWindow }
  | { type: 'popular'; kind: MediaKind }
  | { type: 'topRated'; kind: MediaKind }
  | { type: 'upcoming'; kind: MediaKind }
  | { type: 'nowPlaying' }
  | { type: 'onTheAir' }
  | { type: 'byGenre'; kind: MediaKind; genreId: number; kidsOnly?: boolean }
  | { type: 'kidsSafe'; kind: MediaKind };

export function runDiscoverQuery(
  repository: DiscoverRepository,
  query: DiscoverQuery,
  page: number,
): Promise<Paginated<Title>> {
  switch (query.type) {
    case 'trending':
      return repository.trending(query.kind, query.window, page);
    case 'popular':
      return repository.popular(query.kind, page);
    case 'topRated':
      return repository.topRated(query.kind, page);
    case 'upcoming':
      return repository.upcoming(query.kind, page);
    case 'nowPlaying':
      return repository.nowPlaying(page);
    case 'onTheAir':
      return repository.onTheAir(page);
    case 'byGenre':
      return repository.byGenre(query.kind, query.genreId, page, { kidsOnly: query.kidsOnly });
    case 'kidsSafe':
      return repository.kidsSafe(query.kind, page);
    default:
      return assertNever(query);
  }
}