export type CurrencyCode = 'USD' | 'AZN' | 'EUR';

export interface Money {
  amount: number; 
  currency: CurrencyCode;
}

export function createMoney(amount: number, currency: CurrencyCode = 'USD'): Money {
  if (!Number.isFinite(amount)) {
    throw new Error('Invalid money amount');
  }
  return { amount: Math.round(amount), currency };
}

export function addMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return { amount: Math.max(0, a.amount - b.amount), currency: a.currency };
}

export function multiplyMoney(money: Money, factor: number): Money {
  return { amount: Math.max(0, Math.round(money.amount * factor)), currency: money.currency };
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
}