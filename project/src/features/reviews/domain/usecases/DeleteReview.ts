import type { ReviewRepository } from '../repositories/ReviewRepository';

export class DeleteReview {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(reviewId: string): Promise<void> {
    return this.repository.remove(reviewId);
  }
}