import { AppError } from './AppError';

export type PaymentErrorReason =
  | 'declined'
  | 'insufficient_funds'
  | 'expired_card'
  | 'requires_authentication'
  | 'unknown';

export type PaymentErrorOptions = {
  reason?: PaymentErrorReason;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class PaymentError extends AppError {
  readonly reason: PaymentErrorReason;

  constructor(message: string, options: PaymentErrorOptions = {}) {
    const reason = options.reason ?? 'unknown';
    super(message, {
      code: 'PAYMENT',
      userMessageKey: `errors.payment.${reason}`,
      cause: options.cause,
      details: options.details,
    });
    this.reason = reason;
  }
}