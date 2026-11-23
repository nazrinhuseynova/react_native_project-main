import type { CardBrand, PaymentMethod } from '../entities/PaymentMethod';
import type { Money } from '../entities/Money';
import type { PaymentResult } from '../entities/PaymentResult';

export interface TokenizeCardInput {
  cardholderName: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface TokenizeResult {
  token: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface ChargeInput {
  amount: Money;
  paymentMethod: PaymentMethod;
  description: string;
  idempotencyKey?: string;
}

export interface RefundInput {
  transactionId: string;
  amount: Money;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: 'refunded' | 'failed';
  message?: string;
}

export interface PaymentGateway {
  readonly name: string;
  tokenize(input: TokenizeCardInput): Promise<TokenizeResult>;
  charge(input: ChargeInput): Promise<PaymentResult>;
  complete3ds?(transactionId: string): Promise<PaymentResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}