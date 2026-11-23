import { z } from 'zod';

import { MATURITY_RATINGS } from '../../domain/entities/MaturityRating';
import { PROFILE_NAME_MAX } from '../../domain/entities/Profile';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'profiles.validation.nameRequired')
    .max(PROFILE_NAME_MAX, 'profiles.validation.nameTooLong'),
  isKids: z.boolean(),
  maturity: z.enum(MATURITY_RATINGS),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;