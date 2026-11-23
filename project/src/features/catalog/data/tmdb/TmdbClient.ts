import type { HttpClient } from '@/core/http/HttpClient';
import type { QueryParams } from '@/core/http/types';

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const LANGUAGE_BY_APP_LANGUAGE: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
};

export function toTmdbLanguage(language: string): string {
  return LANGUAGE_BY_APP_LANGUAGE[language] ?? 'en-US';
}

export type TmdbClientOptions = {
  http: HttpClient;
  getLanguage: () => string;
  region?: string;
};

export type TmdbRequestOptions = {
  withRegion?: boolean;
};

export class TmdbClient {
  private readonly http: HttpClient;
  private readonly getLanguage: () => string;
  private readonly region?: string;

  constructor(options: TmdbClientOptions) {
    this.http = options.http;
    this.getLanguage = options.getLanguage;
    this.region = options.region;
  }

  get<T>(path: string, query: QueryParams = {}, options: TmdbRequestOptions = {}): Promise<T> {
    return this.http.get<T>(path, {
      query: {
        language: this.getLanguage(),
        ...(options.withRegion && this.region ? { region: this.region } : {}),
        ...query,
      },
    });
  }
}