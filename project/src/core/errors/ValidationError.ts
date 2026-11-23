import { AppError } from './AppError';

export type ValidationErrorOptions = {
  fields?: Record<string, string>;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class ValidationError extends AppError {
  readonly fields: Record<string, string>;

  constructor(message: string, options: ValidationErrorOptions = {}) {
    super(message, {
      code: 'VALIDATION',
      userMessageKey: 'errors.validation',
      cause: options.cause,
      details: options.details,
    });
    this.fields = options.fields ?? {};
  }
}