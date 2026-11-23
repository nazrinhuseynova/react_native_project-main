import type { Paginated } from '@/shared/types/common';

import type { Title } from '../../../domain/entities/Title';
import type { MediaKind } from '../../../domain/entities/TitleId';
import type { TmdbMediaItemDto, TmdbPageDto } from '../dto/TmdbCommonDto';
import type { TmdbMovieDto } from '../dto/TmdbMovieDto';
import type { TmdbTvDto } from '../dto/TmdbTvDto';
import type { TmdbImageUrlBuilder } from '../TmdbImageUrlBuilder';
import { mapMovie } from './movieMapper';
import { mapTv } from './tvMapper';

const MAX_PAGE = 500;

export function mapPage<T, R>(
  dto: TmdbPageDto<T>,
  mapItem: (item: T) => R | null,
): Paginated<R> {
  const items = dto.results.map(mapItem).filter((item): item is R => item !== null);
  return {
    items,
    page: dto.page,
    totalPages: dto.total_pages,
    totalItems: dto.total_results,
    hasMore: dto.page < Math.min(dto.total_pages, MAX_PAGE),
  };
}


export function withPoster(title: Title): Title | null {
  return title.poster ? title : null;
}

export function mapMediaItem(
  dto: TmdbMediaItemDto,
  images: TmdbImageUrlBuilder,
  fallbackKind?: MediaKind,
): Title | null {
  const kind = dto.media_type ?? fallbackKind;
  if (kind === 'movie') return withPoster(mapMovie(dto as TmdbMovieDto, images));
  if (kind === 'tv') return withPoster(mapTv(dto as TmdbTvDto, images));
  return null;
}