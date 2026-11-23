import { ValidationError } from '@/core/errors/ValidationError';
import { isMaturityRating, type MaturityRating } from '@/features/profiles';

import type { ParentalRepository } from '../repositories/ParentalRepository';

export class SetMaxMaturity {
  private readonly repository: ParentalRepository;

  constructor(repository: ParentalRepository) {
    this.repository = repository;
  }

  async execute(profileId: string, rating: MaturityRating): Promise<void> {
    if (!isMaturityRating(rating)) {
      throw new ValidationError('Invalid maturity rating', {
        fields: { maxMaturity: 'errors.validation' },
      });
    }
    await this.repository.setMaxMaturity(profileId, rating);
  }
}