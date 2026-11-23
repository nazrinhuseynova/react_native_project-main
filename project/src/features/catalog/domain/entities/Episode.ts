import type { Artwork } from './Title';

export type Episode = {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
  runtimeMinutes: number | null;
  airDate: string | null;
  still: Artwork | null;
  voteAverage: number;
};