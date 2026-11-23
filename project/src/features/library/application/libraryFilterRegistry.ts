import { Registry } from '@/core/registry/Registry';

import type { LibraryFilter } from '../domain/filters/LibraryFilter';
import { MoviesOnlyFilter } from '../domain/filters/MoviesOnlyFilter';
import { SeriesOnlyFilter } from '../domain/filters/SeriesOnlyFilter';

export function createLibraryFilterRegistry(): Registry<LibraryFilter> {
  return new Registry<LibraryFilter>().register(new MoviesOnlyFilter()).register(new SeriesOnlyFilter());
}