import { AppError } from './AppError';

export type RateLimitErrorOptions = {
  retryAfterSeconds?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class RateLimitError extends AppError {
  readonly retryAfterSeconds?: number;

  constructor(message: string, options: RateLimitErrorOptions = {}) {
    super(message, {
      code: 'RATE_LIMIT',
      userMessageKey: 'errors.rateLimit',
      cause: options.cause,
      details: options.details,
    });
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}