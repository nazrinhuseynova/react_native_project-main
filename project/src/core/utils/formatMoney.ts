export type CurrencyCode = 'AZN' | 'USD' | 'EUR';

export function formatMoney(amountMinor: number, currency: CurrencyCode, locale = 'en'): string {
  const amount = amountMinor / 100;

  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}