import { pickCertification } from '../../../domain/entities/Certification';
import type { Episode } from '../../../domain/entities/Episode';
import type { Season, SeasonSummary } from '../../../domain/entities/Season';
import type { Series } from '../../../domain/entities/Title';
import { makeTitleId } from '../../../domain/entities/TitleId';
import type { TmdbEpisodeDto, TmdbSeasonDto, TmdbSeasonSummaryDto } from '../dto/TmdbCommonDto';
import type { TmdbTvDto } from '../dto/TmdbTvDto';
import type { TmdbImageUrlBuilder } from '../TmdbImageUrlBuilder';

export type TvMapOptions = {
  certification?: string | null;
};

export function mapSeasonSummary(dto: TmdbSeasonSummaryDto, images: TmdbImageUrlBuilder): SeasonSummary {
  return {
    id: dto.id,
    seasonNumber: dto.season_number,
    name: dto.name,
    episodeCount: dto.episode_count,
    airDate: dto.air_date,
    poster: images.poster(dto.poster_path),
  };
}

export function mapEpisode(dto: TmdbEpisodeDto, images: TmdbImageUrlBuilder): Episode {
  return {
    id: dto.id,
    seasonNumber: dto.season_number,
    episodeNumber: dto.episode_number,
    name: dto.name,
    overview: dto.overview ?? '',
    runtimeMinutes: dto.runtime || null,
    airDate: dto.air_date || null,
    still: images.still(dto.still_path),
    voteAverage: dto.vote_average ?? 0,
  };
}

export function mapSeason(dto: TmdbSeasonDto, images: TmdbImageUrlBuilder): Season {
  return {
    ...mapSeasonSummary(dto, images),
    overview: dto.overview ?? '',
    episodes: (dto.episodes ?? []).map((episode) => mapEpisode(episode, images)),
  };
}

export function mapTv(
  dto: TmdbTvDto,
  images: TmdbImageUrlBuilder,
  options: TvMapOptions = {},
): Series {
  const ratings = (dto.content_ratings?.results ?? [])
    .filter((entry) => entry.rating)
    .map((entry) => ({ country: entry.iso_3166_1, rating: entry.rating }));

  return {
    kind: 'tv',
    id: makeTitleId('tv', dto.id),
    tmdbId: dto.id,
    name: dto.name,
    originalName: dto.original_name,
    overview: dto.overview ?? '',
    tagline: dto.tagline || null,
    poster: images.poster(dto.poster_path),
    backdrop: images.backdrop(dto.backdrop_path),
    releaseDate: dto.first_air_date || null,
    voteAverage: dto.vote_average ?? 0,
    voteCount: dto.vote_count ?? 0,
    popularity: dto.popularity ?? 0,
    genreIds: dto.genre_ids ?? dto.genres?.map((genre) => genre.id) ?? [],
    genres: dto.genres ?? [],
    adult: dto.adult ?? false,
    certification: options.certification ?? pickCertification(ratings),
    originalLanguage: dto.original_language,
    imdbId: dto.external_ids?.imdb_id || null,
    numberOfSeasons: dto.number_of_seasons ?? null,
    numberOfEpisodes: dto.number_of_episodes ?? null,
    episodeRuntimeMinutes: dto.episode_run_time?.[0] ?? null,
    status: dto.status ?? null,
    seasons: (dto.seasons ?? [])
      .filter((season) => season.season_number > 0)
      .map((season) => mapSeasonSummary(season, images)),
  };
}