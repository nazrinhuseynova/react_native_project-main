import type { RegistryItem } from '@/core/registry/Registry';

import type { LibraryItem } from '../entities/LibraryEntry';

export interface LibrarySorter extends RegistryItem {
  readonly labelKey: string;
  compare(a: LibraryItem, b: LibraryItem): number;
}