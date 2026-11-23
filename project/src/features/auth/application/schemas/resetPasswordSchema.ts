import { z } from 'zod';

import { PasswordPolicy } from '../../domain/policies/PasswordPolicy';

const passwordPolicy = new PasswordPolicy();

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'auth.validation.passwordRequired')
      .refine((value) => passwordPolicy.validate(value).valid, 'auth.validation.passwordWeak'),
    confirmPassword: z.string().min(1, 'auth.validation.passwordRequired'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.validation.passwordMismatch',
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;