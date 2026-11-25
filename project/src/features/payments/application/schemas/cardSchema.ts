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

// 13-19 rəqəm, istəyə görə rəqəmlər arasında tək boşluq (məs. "4111 1111 1111 1111")
const CARD_NUMBER_REGEX = /^(?:\d ?){13,19}$/;
// 1-12 (tək rəqəm və ya 01-12)
const MONTH_REGEX = /^(0?[1-9]|1[0-2])$/;
// 2024-2050
const YEAR_REGEX = /^(202[4-9]|20[34]\d|2050)$/;
// 3 və ya 4 rəqəm
const CVC_REGEX = /^\d{3,4}$/;

const asString = (value: unknown) => (value === undefined || value === null ? '' : String(value).trim());

export const cardSchema = z
  .object({
    cardholderName: z
      .string()
      .trim()
      .min(2, 'Kart sahibinin adını daxil edin')
      .max(60, 'Ad çox uzundur'),
    cardNumber: z
      .string()
      .trim()
      .regex(CARD_NUMBER_REGEX, 'Kart nömrəsi 13-19 rəqəm olmalıdır')
      .refine(isValidLuhn, 'Kart nömrəsi düzgün deyil'),
    expMonth: z.preprocess(
      asString,
      z.string().regex(MONTH_REGEX, 'Ay 1-12 aralığında olmalıdır').transform(Number),
    ),
    expYear: z.preprocess(
      asString,
      z.string().regex(YEAR_REGEX, 'İl 2024-2050 aralığında olmalıdır').transform(Number),
    ),
    cvc: z.preprocess(asString, z.string().regex(CVC_REGEX, 'CVC 3 və ya 4 rəqəmdən ibarət olmalıdır')),
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