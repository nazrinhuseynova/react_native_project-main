import { AppError } from './AppError';

export type NetworkErrorReason = 'offline' | 'timeout' | 'http' | 'aborted';

export type NetworkErrorOptions = {
  reason: NetworkErrorReason;
  status?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class NetworkError extends AppError {
  readonly reason: NetworkErrorReason;
  readonly status?: number;

  constructor(message: string, options: NetworkErrorOptions) {
    super(message, {
      code: 'NETWORK',
      userMessageKey: `errors.network.${options.reason}`,
      cause: options.cause,
      details: options.details,
    });
    this.reason = options.reason;
    this.status = options.status;
  }

  get isRetryable(): boolean {
    if (this.reason === 'offline' || this.reason === 'timeout') return true;
    return (
      this.reason === 'http' &&
      this.status !== undefined &&
      (this.status >= 500 || this.status === 408)
    );
  }
}