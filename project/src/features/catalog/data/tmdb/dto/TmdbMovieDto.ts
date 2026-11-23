import type { TmdbGenreDto } from './TmdbCommonDto';

export type TmdbMovieDto = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genre_ids?: number[];
  genres?: TmdbGenreDto[];
  runtime?: number | null;
  imdb_id?: string | null;
  release_dates?: {
    results: { iso_3166_1: string; release_dates: { certification: string }[] }[];
  };
};