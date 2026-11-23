import { Registry } from '@/core/registry/Registry';
import type { DiscoverRepository, GenreRepository } from '@/features/catalog';

import { GenreSearchStrategy } from '../domain/strategies/GenreSearchStrategy';
import { PersonSearchStrategy } from '../domain/strategies/PersonSearchStrategy';
import type { SearchStrategy } from '../domain/strategies/SearchStrategy';
import { TitleSearchStrategy } from '../domain/strategies/TitleSearchStrategy';
import type { SearchRepository } from '../domain/repositories/SearchRepository';

export type SearchStrategyDeps = {
  repository: SearchRepository;
  genres: GenreRepository;
  discover: DiscoverRepository;
};

export function createSearchStrategyRegistry({
  repository,
  genres,
  discover,
}: SearchStrategyDeps): Registry<SearchStrategy> {
  return new Registry<SearchStrategy>()
    .register(new TitleSearchStrategy(repository))
    .register(new PersonSearchStrategy(repository))
    .register(new GenreSearchStrategy(genres, discover));
}