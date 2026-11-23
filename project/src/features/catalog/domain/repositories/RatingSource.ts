import type { Title } from '../entities/Title';

export type Rating = {
  source: 'tmdb' | 'imdb';
  value: number;
  scale: 10;
  votes: number | null;
};

export type RatingQuery = Pick<Title, 'id' | 'imdbId' | 'voteAverage' | 'voteCount'>;

export interface RatingSource {
  readonly id: Rating['source'];
  get(query: RatingQuery): Promise<Rating | null>;
}