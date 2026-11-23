import { z } from 'zod';

import { MAX_STARS, MIN_STARS, REVIEW_TEXT_MAX } from '../../domain/policies/ReviewPolicy';

export const reviewSchema = z.object({
  stars: z
    .number()
    .int('reviews.validation.stars')
    .min(MIN_STARS, 'reviews.validation.stars')
    .max(MAX_STARS, 'reviews.validation.stars'),
  text: z.string().trim().max(REVIEW_TEXT_MAX, 'reviews.validation.textTooLong'),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;