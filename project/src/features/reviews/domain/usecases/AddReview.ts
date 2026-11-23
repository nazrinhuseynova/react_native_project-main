import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import type { TitleId } from '@/features/catalog';

import type { Review } from '../entities/Review';
import type { ReviewPolicy } from '../policies/ReviewPolicy';
import type { ReviewRepository } from '../repositories/ReviewRepository';

export type AddReviewInput = {
  userId: string;
  titleId: TitleId;
  stars: number;
  text: string;
  authorName: string;
};

export class AddReview {
  private readonly repository: ReviewRepository;
  private readonly policy: ReviewPolicy;
  private readonly events: EventBus<AppEvents>;

  constructor(repository: ReviewRepository, policy: ReviewPolicy, events: EventBus<AppEvents>) {
    this.repository = repository;
    this.policy = policy;
    this.events = events;
  }

  async execute(input: AddReviewInput): Promise<Review> {
    const valid = this.policy.validate({ stars: input.stars, text: input.text });
    const review = await this.repository.add({ ...input, ...valid });
    this.events.emit('title.rated', { titleId: input.titleId, stars: review.stars });
    return review;
  }
}