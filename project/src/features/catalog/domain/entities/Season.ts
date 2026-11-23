import type { Episode } from './Episode';
import type { Artwork } from './Title';

export type SeasonSummary = {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  poster: Artwork | null;
};

export type Season = SeasonSummary & {
  overview: string;
  episodes: Episode[];
};