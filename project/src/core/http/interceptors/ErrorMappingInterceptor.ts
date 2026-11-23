import { AuthError } from '@/core/errors/AuthError';
import { NetworkError } from '@/core/errors/NetworkError';
import { NotFoundError } from '@/core/errors/NotFoundError';
import { RateLimitError } from '@/core/errors/RateLimitError';
import { ValidationError } from '@/core/errors/ValidationError';

import type { Interceptor, NextHandler } from '../Interceptor';
import type { HttpRequest, HttpResponse } from '../types';

export class ErrorMappingInterceptor implements Interceptor {
  async intercept(request: HttpRequest, next: NextHandler): Promise<HttpResponse> {
    try {
      return await next(request);
    } catch (error) {
      throw this.map(error);
    }
  }

  private map(error: unknown): unknown {
    if (!(error instanceof NetworkError) || error.status === undefined) return error;

    const options = { cause: error, details: error.details };

    switch (error.status) {
      case 400:
      case 422:
        return new ValidationError(error.message, options);
      case 401:
        return new AuthError(error.message, { ...options, reason: 'session_expired' });
      case 403:
        return new AuthError(error.message, { ...options, reason: 'unauthorized' });
      case 404:
        return new NotFoundError(error.message, options);
      case 429:
        return new RateLimitError(error.message, {
          ...options,
          retryAfterSeconds: parseRetryAfter(error.details),
        });
      default:
        return error;
    }
  }
}

function parseRetryAfter(details?: Record<string, unknown>): number | undefined {
  const raw = details?.retryAfter;
  if (typeof raw !== 'string') return undefined;
  const seconds = Number(raw);
  return Number.isFinite(seconds) ? seconds : undefined;
}