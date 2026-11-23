import { AppError } from './AppError';

export type AuthErrorReason =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_already_exists'
  | 'session_expired'
  | 'unauthorized'
  | 'weak_password'
  | 'too_many_attempts'
  | 'otp_invalid'
  | 'otp_expired'
  | 'unknown';

export type AuthErrorOptions = {
  reason?: AuthErrorReason;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class AuthError extends AppError {
  readonly reason: AuthErrorReason;

  constructor(message: string, options: AuthErrorOptions = {}) {
    const reason = options.reason ?? 'unknown';
    super(message, {
      code: 'AUTH',
      userMessageKey: `errors.auth.${reason}`,
      cause: options.cause,
      details: options.details,
    });
    this.reason = reason;
  }
}