import { z } from 'zod';

function isValidLuhn(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export const cardSchema = z
  .object({
    cardholderName: z.string().trim().min(2, 'Kart sahibinin adını daxil edin'),
    cardNumber: z
      .string()
      .trim()
      .refine(isValidLuhn, 'Kart nömrəsi düzgün deyil'),
    expMonth: z.coerce.number().int().min(1, 'Ay 1-12 aralığında olmalıdır').max(12, 'Ay 1-12 aralığında olmalıdır'),
    expYear: z.coerce.number().int().min(2024, 'İl düzgün deyil').max(2050, 'İl düzgün deyil'),
    cvc: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, 'CVC 3 və ya 4 rəqəmdən ibarət olmalıdır'),
    setAsDefault: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (data.expYear < currentYear) return false;
      if (data.expYear === currentYear && data.expMonth < currentMonth) return false;
      return true;
    },
    {
      path: ['expYear'],
      message: 'Kartın vaxtı bitib',
    },
  );

export type CardFormValues = z.infer<typeof cardSchema>;