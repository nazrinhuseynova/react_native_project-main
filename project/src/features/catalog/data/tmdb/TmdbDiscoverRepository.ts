import type { QueryParams } from '@/core/http/types';
import type { Paginated } from '@/shared/types/common';

import type { Title } from '../../domain/entities/Title';
import type { MediaKind } from '../../domain/entities/TitleId';
import type {
  DiscoverKind,
  DiscoverRepository,
  GenreOptions,
  TrendingWindow,
} from '../../domain/repositories/DiscoverRepository';
import type { TmdbMediaItemDto, TmdbPageDto } from './dto/TmdbCommonDto';
import type { TmdbMovieDto } from './dto/TmdbMovieDto';
import type { TmdbTvDto } from './dto/TmdbTvDto';
import { mapMovie } from './mappers/movieMapper';
import { mapMediaItem, mapPage, withPoster } from './mappers/pageMapper';
import { mapTv } from './mappers/tvMapper';
import type { TmdbClient } from './TmdbClient';
import type { TmdbImageUrlBuilder } from './TmdbImageUrlBuilder';

const GENRE_ANIMATION = 16;
const GENRE_FAMILY = 10751;
const GENRE_KIDS_TV = 10762;

function tomorrowIso(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export class TmdbDiscoverRepository implements DiscoverRepository {
  private readonly client: TmdbClient;
  private readonly images: TmdbImageUrlBuilder;

  constructor(client: TmdbClient, images: TmdbImageUrlBuilder) {
    this.client = client;
    this.images = images;
  }

  async trending(kind: DiscoverKind, window: TrendingWindow, page = 1): Promise<Paginated<Title>> {
    const dto = await this.client.get<TmdbPageDto<TmdbMediaItemDto>>(`/trending/${kind}/${window}`, {
      page,
    });
    const fallback = kind === 'all' ? undefined : kind;
    return mapPage(dto, (item) => mapMediaItem(item, this.images, fallback));
  }

  popular(kind: MediaKind, page = 1): Promise<Paginated<Title>> {
    return kind === 'movie'
      ? this.movies('/movie/popular', { page })
      : this.shows('/tv/popular', { page });
  }

  topRated(kind: MediaKind, page = 1): Promise<Paginated<Title>> {
    return kind === 'movie'
      ? this.movies('/movie/top_rated', { page })
      : this.shows('/tv/top_rated', { page });
  }

  upcoming(kind: MediaKind, page = 1): Promise<Paginated<Title>> {
    if (kind === 'movie') return this.movies('/movie/upcoming', { page }, true);
    return this.shows('/discover/tv', {
      page,
      sort_by: 'first_air_date.asc',
      'first_air_date.gte': tomorrowIso(),
    });
  }

  nowPlaying(page = 1): Promise<Paginated<Title>> {
    return this.movies('/movie/now_playing', { page }, true);
  }

  onTheAir(page = 1): Promise<Paginated<Title>> {
    return this.shows('/tv/on_the_air', { page });
  }

  byGenre(
    kind: MediaKind,
    genreId: number,
    page = 1,
    options: GenreOptions = {},
  ): Promise<Paginated<Title>> {
    const base: QueryParams = {
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
      'vote_count.gte': kind === 'movie' ? 100 : 50,
    };

    if (kind === 'movie') {
      const kids: QueryParams = options.kidsOnly
        ? { certification_country: 'US', 'certification.lte': 'PG' }
        : {};
      return this.movies(
        '/discover/movie',
        { ...base, ...kids, with_genres: genreId },
        false,
        options.kidsOnly ? 'PG' : undefined,
      );
    }

    const withGenres = options.kidsOnly ? `${genreId},${GENRE_FAMILY}` : String(genreId);
    return this.shows(
      '/discover/tv',
      { ...base, with_genres: withGenres },
      options.kidsOnly ? 'TV-Y7' : undefined,
    );
  }

  kidsSafe(kind: MediaKind, page = 1): Promise<Paginated<Title>> {
    const base: QueryParams = {
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
      'vote_count.gte': 50,
    };

    if (kind === 'movie') {
      return this.movies(
        '/discover/movie',
        {
          ...base,
          certification_country: 'US',
          'certification.lte': 'PG',
          with_genres: `${GENRE_ANIMATION}|${GENRE_FAMILY}`,
        },
        false,
        'PG',
      );
    }
    return this.shows('/discover/tv', { ...base, with_genres: GENRE_KIDS_TV }, 'TV-Y7');
  }

  private async movies(
    path: string,
    query: QueryParams,
    withRegion = false,
    certification?: string,
  ): Promise<Paginated<Title>> {
    const dto = await this.client.get<TmdbPageDto<TmdbMovieDto>>(path, query, { withRegion });
    return mapPage(dto, (item) => withPoster(mapMovie(item, this.images, { certification })));
  }

  private async shows(
    path: string,
    query: QueryParams,
    certification?: string,
  ): Promise<Paginated<Title>> {
    const dto = await this.client.get<TmdbPageDto<TmdbTvDto>>(path, query);
    return mapPage(dto, (item) => withPoster(mapTv(item, this.images, { certification })));
  }
}