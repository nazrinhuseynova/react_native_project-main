import { Registry } from '@/core/registry/Registry';

import { AlphabeticalSorter } from '../domain/sorters/AlphabeticalSorter';
import type { LibrarySorter } from '../domain/sorters/LibrarySorter';
import { RecentlyAddedSorter } from '../domain/sorters/RecentlyAddedSorter';

export const DEFAULT_SORTER_ID = 'recent';

/** Yeni sıralama = yeni sorter sinfi + aşağıya 1 sətir. */
export function createLibrarySortRegistry(): Registry<LibrarySorter> {
  return new Registry<LibrarySorter>()
    .register(new RecentlyAddedSorter())
    .register(new AlphabeticalSorter());
}