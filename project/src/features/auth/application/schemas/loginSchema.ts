import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'auth.validation.emailRequired')
    .email('auth.validation.emailInvalid'),
  password: z.string().min(1, 'auth.validation.passwordRequired'),
});

export type LoginValues = z.infer<typeof loginSchema>;