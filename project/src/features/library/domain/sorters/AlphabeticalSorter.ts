import type { LibraryItem } from '../entities/LibraryEntry';
import type { LibrarySorter } from './LibrarySorter';

export class AlphabeticalSorter implements LibrarySorter {
  readonly id = 'alphabetical';
  readonly order = 1;
  readonly labelKey = 'library.sort.alphabetical';

  compare(a: LibraryItem, b: LibraryItem): number {
    return a.title.name.localeCompare(b.title.name, undefined, { sensitivity: 'base' });
  }
}