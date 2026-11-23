import type { TmdbMovieDto } from './TmdbMovieDto';
import type { TmdbTvDto } from './TmdbTvDto';

export type TmdbPageDto<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbGenreDto = { id: number; name: string };
export type TmdbGenreListDto = { genres: TmdbGenreDto[] };

export type TmdbPersonDto = {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  known_for_department?: string | null;
  profile_path: string | null;
};

export type TmdbMediaItemDto =
  | (TmdbMovieDto & { media_type?: 'movie' })
  | (TmdbTvDto & { media_type?: 'tv' })
  | { id: number; media_type: 'person' };

export type TmdbCombinedCreditsDto = { cast: TmdbMediaItemDto[] };

export type TmdbSeasonSummaryDto = {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
};

export type TmdbEpisodeDto = {
  id: number;
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  runtime?: number | null;
  air_date?: string | null;
  still_path: string | null;
  vote_average: number;
};

export type TmdbSeasonDto = TmdbSeasonSummaryDto & {
  overview: string;
  episodes: TmdbEpisodeDto[];
};