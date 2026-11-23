import type { LibraryItem } from '../entities/LibraryEntry';
import type { LibrarySorter } from './LibrarySorter';

export class RecentlyAddedSorter implements LibrarySorter {
  readonly id = 'recent';
  readonly order = 0;
  readonly labelKey = 'library.sort.recent';

  compare(a: LibraryItem, b: LibraryItem): number {
    return b.entry.addedAt.localeCompare(a.entry.addedAt);
  }
}