import type { RegistryItem } from '@/core/registry/Registry';

import type { LibraryItem } from '../entities/LibraryEntry';

export interface LibraryFilter extends RegistryItem {
  readonly labelKey: string;
  matches(item: LibraryItem): boolean;
}