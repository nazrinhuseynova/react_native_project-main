import { z } from 'zod';

import { PasswordPolicy } from '@/features/auth';

const passwordPolicy = new PasswordPolicy();

export const changePasswordSchema = z
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

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid'),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;