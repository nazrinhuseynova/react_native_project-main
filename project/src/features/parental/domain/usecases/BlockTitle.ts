import { ValidationError } from '@/core/errors/ValidationError';

import type { BlockedTitleInput } from '../entities/ParentalSettings';
import type { ParentalRepository } from '../repositories/ParentalRepository';

export class BlockTitle {
  private readonly repository: ParentalRepository;

  constructor(repository: ParentalRepository) {
    this.repository = repository;
  }

  async execute(profileId: string, title: BlockedTitleInput): Promise<void> {
    if (!title.titleId || !title.title.trim()) {
      throw new ValidationError('Invalid title to block', { fields: { title: 'errors.validation' } });
    }
    await this.repository.block(profileId, { ...title, title: title.title.trim() });
  }
}