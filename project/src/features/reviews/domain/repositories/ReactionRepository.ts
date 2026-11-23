import type { TitleId } from '@/features/catalog';

import type { Reaction } from '../entities/Reaction';

export interface ReactionRepository {
  get(userId: string, titleId: TitleId): Promise<Reaction | null>;
  set(userId: string, titleId: TitleId, reaction: Reaction): Promise<void>;
  clear(userId: string, titleId: TitleId): Promise<void>;
}