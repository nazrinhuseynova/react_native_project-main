import {
  HTTP_RETRY_BASE_DELAY_MS,
  HTTP_RETRY_COUNT,
} from '@/core/config/constants';
import { NetworkError } from '@/core/errors/NetworkError';

import type { Interceptor, NextHandler } from '../Interceptor';
import type { HttpMethod, HttpRequest, HttpResponse } from '../types';

export type RetryOptions = {
  retries?: number;
  baseDelayMs?: number;
  methods?: HttpMethod[];
};

export class RetryInterceptor implements Interceptor {
  private readonly retries: number;
  private readonly baseDelayMs: number;
  private readonly methods: ReadonlySet<HttpMethod>;

  constructor(options: RetryOptions = {}) {
    this.retries = options.retries ?? HTTP_RETRY_COUNT;
    this.baseDelayMs = options.baseDelayMs ?? HTTP_RETRY_BASE_DELAY_MS;
    this.methods = new Set(options.methods ?? ['GET', 'PUT', 'DELETE']);
  }

  async intercept(request: HttpRequest, next: NextHandler): Promise<HttpResponse> {
    let attempt = 0;

    for (;;) {
      try {
        return await next(request);
      } catch (error) {
        if (attempt >= this.retries || !this.canRetry(error, request)) throw error;
        await wait(this.nextDelay(attempt), request.signal);
        attempt += 1;
      }
    }
  }

  private canRetry(error: unknown, request: HttpRequest): boolean {
    return (
      this.methods.has(request.method) && error instanceof NetworkError && error.isRetryable
    );
  }

  private nextDelay(attempt: number): number {
    const exponential = this.baseDelayMs * 2 ** attempt;
    return exponential / 2 + Math.random() * (exponential / 2);
  }
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abortError = () => new NetworkError('Request aborted', { reason: 'aborted' });

    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onAbort = () => {
      if (timer) clearTimeout(timer);
      reject(abortError());
    };

    timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}