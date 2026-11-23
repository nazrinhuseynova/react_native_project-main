import type { HttpClient } from '@/core/http/HttpClient';

import type { Rating, RatingQuery, RatingSource } from '../../domain/repositories/RatingSource';

export const OMDB_BASE_URL = 'https://www.omdbapi.com';

type OmdbResponse = {
  Response: 'True' | 'False';
  imdbRating?: string;
  imdbVotes?: string;
};

export class OmdbImdbRatingSource implements RatingSource {
  readonly id = 'imdb' as const;
  private readonly http: HttpClient;
  private readonly apiKey: string;

  constructor(http: HttpClient, apiKey: string) {
    this.http = http;
    this.apiKey = apiKey;
  }

  async get(query: RatingQuery): Promise<Rating | null> {
    if (!this.apiKey || !query.imdbId) return null;

    try {
      const dto = await this.http.get<OmdbResponse>('/', {
        query: { i: query.imdbId, apikey: this.apiKey },
      });
      if (dto.Response !== 'True') return null;

      const value = Number(dto.imdbRating);
      if (!Number.isFinite(value)) return null;

      const votes = Number((dto.imdbVotes ?? '').replace(/,/g, ''));
      return { source: 'imdb', value, scale: 10, votes: Number.isFinite(votes) ? votes : null };
    } catch {

      return null;
    }
  }
}