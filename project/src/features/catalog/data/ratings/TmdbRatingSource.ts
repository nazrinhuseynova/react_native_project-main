import type { Rating, RatingQuery, RatingSource } from '../../domain/repositories/RatingSource';

export class TmdbRatingSource implements RatingSource {
  readonly id = 'tmdb' as const;

  async get(query: RatingQuery): Promise<Rating | null> {
    if (query.voteCount <= 0) return null;
    return { source: 'tmdb', value: query.voteAverage, scale: 10, votes: query.voteCount };
  }
}