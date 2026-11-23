import { NotFoundError } from '@/core/errors/NotFoundError';
import type { Paginated } from '@/shared/types/common';

import type { TitleCredits } from '../../domain/entities/CastMember';
import type { Season } from '../../domain/entities/Season';
import type { Title } from '../../domain/entities/Title';
import { parseTitleId, type MediaKind, type TitleId } from '../../domain/entities/TitleId';
import type { Video } from '../../domain/entities/Video';
import type { TitleRepository } from '../../domain/repositories/TitleRepository';
import type { TmdbPageDto, TmdbSeasonDto } from './dto/TmdbCommonDto';
import type { TmdbCreditsDto } from './dto/TmdbCreditsDto';
import type { TmdbMovieDto } from './dto/TmdbMovieDto';
import type { TmdbTvDto } from './dto/TmdbTvDto';
import type { TmdbVideoDto } from './dto/TmdbVideoDto';
import { mapCredits } from './mappers/creditsMapper';
import { mapMovie } from './mappers/movieMapper';
import { mapPage, withPoster } from './mappers/pageMapper';
import { mapSeason, mapTv } from './mappers/tvMapper';
import { mapVideos } from './mappers/videoMapper';
import type { TmdbClient } from './TmdbClient';
import type { TmdbImageUrlBuilder } from './TmdbImageUrlBuilder';

export class TmdbTitleRepository implements TitleRepository {
  private readonly client: TmdbClient;
  private readonly images: TmdbImageUrlBuilder;

  constructor(client: TmdbClient, images: TmdbImageUrlBuilder) {
    this.client = client;
    this.images = images;
  }

  async details(id: TitleId): Promise<Title> {
    const { kind, tmdbId } = this.parse(id);

    if (kind === 'movie') {
      const dto = await this.client.get<TmdbMovieDto>(`/movie/${tmdbId}`, {
        append_to_response: 'release_dates',
      });
      return mapMovie(dto, this.images);
    }

    const dto = await this.client.get<TmdbTvDto>(`/tv/${tmdbId}`, {
      append_to_response: 'content_ratings,external_ids',
    });
    return mapTv(dto, this.images);
  }

  async credits(id: TitleId): Promise<TitleCredits> {
    const { kind, tmdbId } = this.parse(id);
    const dto = await this.client.get<TmdbCreditsDto>(`/${kind}/${tmdbId}/credits`);
    return mapCredits(dto, this.images);
  }

  similar(id: TitleId, page = 1): Promise<Paginated<Title>> {
    return this.list(id, 'similar', page);
  }

  recommendations(id: TitleId, page = 1): Promise<Paginated<Title>> {
    return this.list(id, 'recommendations', page);
  }

  async videos(id: TitleId): Promise<Video[]> {
    const { kind, tmdbId } = this.parse(id);
    const dto = await this.client.get<TmdbVideoDto>(`/${kind}/${tmdbId}/videos`, {
      include_video_language: 'en,null',
    });
    return mapVideos(dto);
  }

  async season(id: TitleId, seasonNumber: number): Promise<Season> {
    const { kind, tmdbId } = this.parse(id);
    if (kind !== 'tv') throw new NotFoundError('Only series have seasons', { resource: 'season' });
    const dto = await this.client.get<TmdbSeasonDto>(`/tv/${tmdbId}/season/${seasonNumber}`);
    return mapSeason(dto, this.images);
  }

  private async list(
    id: TitleId,
    endpoint: 'similar' | 'recommendations',
    page: number,
  ): Promise<Paginated<Title>> {
    const { kind, tmdbId } = this.parse(id);
    const path = `/${kind}/${tmdbId}/${endpoint}`;

    if (kind === 'movie') {
      const dto = await this.client.get<TmdbPageDto<TmdbMovieDto>>(path, { page });
      return mapPage(dto, (item) => withPoster(mapMovie(item, this.images)));
    }
    const dto = await this.client.get<TmdbPageDto<TmdbTvDto>>(path, { page });
    return mapPage(dto, (item) => withPoster(mapTv(item, this.images)));
  }

  private parse(id: TitleId): { kind: MediaKind; tmdbId: number } {
    const parsed = parseTitleId(id);
    if (!parsed) throw new NotFoundError('Invalid title id', { resource: 'title' });
    return parsed;
  }
}