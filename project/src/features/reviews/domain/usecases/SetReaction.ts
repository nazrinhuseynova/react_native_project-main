import type { TitleId } from '@/features/catalog';

import type { Reaction } from '../entities/Reaction';
import type { ReactionRepository } from '../repositories/ReactionRepository';

export class SetReaction {
  private readonly repository: ReactionRepository;

  constructor(repository: ReactionRepository) {
    this.repository = repository;
  }

  /** reaction = null → reaksiyanı sil. */
  async execute(userId: string, titleId: TitleId, reaction: Reaction | null): Promise<void> {
    if (reaction === null) {
      await this.repository.clear(userId, titleId);
      return;
    }
    await this.repository.set(userId, titleId, reaction);
  }
}