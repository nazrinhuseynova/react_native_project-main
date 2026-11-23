import { ValidationError } from '@/core/errors/ValidationError';

export const MIN_STARS = 1;
export const MAX_STARS = 5;
export const REVIEW_TEXT_MAX = 1000;

export type ReviewDraft = {
  stars: number;
  text: string;
};

export class ReviewPolicy {
  validate(draft: ReviewDraft): ReviewDraft {
    const text = draft.text.trim();
    const fields: Record<string, string> = {};

    if (!Number.isInteger(draft.stars) || draft.stars < MIN_STARS || draft.stars > MAX_STARS) {
      fields.stars = 'reviews.validation.stars';
    }
    if (text.length > REVIEW_TEXT_MAX) {
      fields.text = 'reviews.validation.textTooLong';
    }

    if (Object.keys(fields).length > 0) {
      throw new ValidationError('Invalid review', { fields });
    }
    return { stars: draft.stars, text };
  }
}