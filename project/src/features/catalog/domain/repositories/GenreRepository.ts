import type { Genre } from '../entities/Genre';
import type { MediaKind } from '../entities/TitleId';

export interface GenreRepository {
  list(kind: MediaKind): Promise<Genre[]>;
  all(): Promise<Genre[]>;
}