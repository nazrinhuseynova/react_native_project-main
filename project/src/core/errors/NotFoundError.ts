import { AppError } from './AppError';

export type NotFoundErrorOptions = {
  resource?: string;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class NotFoundError extends AppError {
  readonly resource?: string;

  constructor(message: string, options: NotFoundErrorOptions = {}) {
    super(message, {
      code: 'NOT_FOUND',
      userMessageKey: 'errors.notFound',
      cause: options.cause,
      details: options.details,
    });
    this.resource = options.resource;
  }
}