import type { CastMember, CrewMember } from './CastMember';
import type { Genre } from './Genre';
import type { SeasonSummary } from './Season';
import type { MediaKind, TitleId } from './TitleId';

export type Artwork = {
  small: string;
  medium: string;
  large: string;
};

type BaseTitle = {
  id: TitleId;
  tmdbId: number;
  kind: MediaKind;
  name: string;
  originalName: string;
  overview: string;
  tagline: string | null;
  poster: Artwork | null;
  backdrop: Artwork | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  genres: Genre[];
  adult: boolean;
  certification: string | null;
  originalLanguage: string;
  imdbId: string | null;
};

export type Movie = BaseTitle & {
  kind: 'movie';
  runtimeMinutes: number | null;
};

export type Series = BaseTitle & {
  kind: 'tv';
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  episodeRuntimeMinutes: number | null;
  status: string | null;
  seasons: SeasonSummary[];
};

export type Title = Movie | Series;

export type TitleDetails = {
  title: Title;
  cast: CastMember[];
  crew: CrewMember[];
};

export function isMovie(title: Title): title is Movie {
  return title.kind === 'movie';
}

export function isSeries(title: Title): title is Series {
  return title.kind === 'tv';
}

export function releaseYear(title: Pick<Title, 'releaseDate'>): string {
  return title.releaseDate ? title.releaseDate.slice(0, 4) : '';
}