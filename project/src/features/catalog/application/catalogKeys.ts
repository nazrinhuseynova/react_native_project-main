import type { DiscoverQuery } from '../domain/repositories/DiscoverRepository';

export const catalogKeys = {
  all: ['catalog'] as const,
  discover: (query: DiscoverQuery, language: string) =>
    ['catalog', 'discover', language, query] as const,
  details: (id: string, language: string) => ['catalog', 'details', language, id] as const,
  recommendations: (id: string, language: string) =>
    ['catalog', 'recommendations', language, id] as const,
  trailers: (id: string, language: string) => ['catalog', 'trailers', language, id] as const,
  genres: (kind: string, language: string) => ['catalog', 'genres', language, kind] as const,
  person: (id: number, language: string) => ['catalog', 'person', language, id] as const,
  personCredits: (id: number, language: string) =>
    ['catalog', 'personCredits', language, id] as const,
  season: (id: string, seasonNumber: number, language: string) =>
    ['catalog', 'season', language, id, seasonNumber] as const,
  rating: (id: string, source: string) => ['catalog', 'rating', id, source] as const,
};