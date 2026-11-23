import type { LibraryItem } from '../entities/LibraryEntry';
import type { LibraryFilter } from './LibraryFilter';

export class MoviesOnlyFilter implements LibraryFilter {
  readonly id = 'movies';
  readonly order = 0;
  readonly labelKey = 'library.filter.movies';

  matches(item: LibraryItem): boolean {
    return item.title.kind === 'movie';
  }
}