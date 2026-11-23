import type { TmdbGenreDto, TmdbSeasonSummaryDto } from './TmdbCommonDto';

export type TmdbTvDto = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  tagline?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult?: boolean;
  original_language: string;
  genre_ids?: number[];
  genres?: TmdbGenreDto[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  seasons?: TmdbSeasonSummaryDto[];
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  external_ids?: { imdb_id?: string | null };
};