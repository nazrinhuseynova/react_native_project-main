import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import type { TitleId } from '@/features/catalog';

import type { Review } from '../entities/Review';
import type { ReviewPolicy } from '../policies/ReviewPolicy';
import type { ReviewRepository } from '../repositories/ReviewRepository';

export class EditReview {
  private readonly repository: ReviewRepository;
  private readonly policy: ReviewPolicy;
  private readonly events: EventBus<AppEvents>;

  constructor(repository: ReviewRepository, policy: ReviewPolicy, events: EventBus<AppEvents>) {
    this.repository = repository;
    this.policy = policy;
    this.events = events;
  }

  async execute(
    reviewId: string,
    titleId: TitleId,
    draft: { stars: number; text: string },
  ): Promise<Review> {
    const valid = this.policy.validate(draft);
    const review = await this.repository.update(reviewId, valid);
    this.events.emit('title.rated', { titleId, stars: review.stars });
    return review;
  }
}