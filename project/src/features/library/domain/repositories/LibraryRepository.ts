import type { TitleId } from '@/features/catalog';

import type { LibraryEntry } from '../entities/LibraryEntry';

export interface LibraryRepository {
  list(profileId: string): Promise<LibraryEntry[]>;
  find(profileId: string, titleId: TitleId): Promise<LibraryEntry | null>;
  upsert(profileId: string, entry: LibraryEntry): Promise<LibraryEntry>;
  remove(profileId: string, titleId: TitleId): Promise<void>;
}