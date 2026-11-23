import type { SearchFilter } from '../domain/entities/SearchFilter';

export const searchKeys = {
  all: ['search'] as const,
  results: (language: string, query: string, filter: SearchFilter) =>
    ['search', 'results', language, query, filter] as const,
  recent: ['search', 'recent'] as const,
  top: (language: string) => ['search', 'top', language] as const,
};