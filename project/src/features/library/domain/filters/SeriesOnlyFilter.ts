import type { LibraryItem } from '../entities/LibraryEntry';
import type { LibraryFilter } from './LibraryFilter';

export class SeriesOnlyFilter implements LibraryFilter {
  readonly id = 'series';
  readonly order = 1;
  readonly labelKey = 'library.filter.series';

  matches(item: LibraryItem): boolean {
    return item.title.kind === 'tv';
  }
}