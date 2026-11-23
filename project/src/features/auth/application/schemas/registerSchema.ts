import { z } from 'zod';

import { PasswordPolicy } from '../../domain/policies/PasswordPolicy';

const passwordPolicy = new PasswordPolicy();

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'auth.validation.emailRequired')
      .email('auth.validation.emailInvalid'),
    password: z
      .string()
      .min(1, 'auth.validation.passwordRequired')
      .refine((value) => passwordPolicy.validate(value).valid, 'auth.validation.passwordWeak'),
    confirmPassword: z.string().min(1, 'auth.validation.passwordRequired'),
    acceptTerms: z.boolean().refine((value) => value === true, 'auth.validation.termsRequired'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'auth.validation.passwordMismatch',
  });

export type RegisterValues = z.infer<typeof registerSchema>;