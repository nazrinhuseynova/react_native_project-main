import type { LibraryFilter } from '../filters/LibraryFilter';
import type { LibraryItem, LibraryTab } from '../entities/LibraryEntry';
import type { LibrarySorter } from '../sorters/LibrarySorter';

export type LibraryQuery = {
  tab: LibraryTab;
  sorter: LibrarySorter;
  filter: LibraryFilter | null;
};

export class QueryLibrary {
  execute(items: readonly LibraryItem[], { tab, sorter, filter }: LibraryQuery): LibraryItem[] {
    return items
      .filter((item) => (tab === 'saved' ? item.entry.saved : item.entry.favorite))
      .filter((item) => (filter ? filter.matches(item) : true))
      .sort((a, b) => sorter.compare(a, b));
  }
}