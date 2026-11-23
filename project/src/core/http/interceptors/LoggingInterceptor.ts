import type { Logger } from '@/core/logging/Logger';

import type { Interceptor, NextHandler } from '../Interceptor';
import type { HttpRequest, HttpResponse } from '../types';

export class LoggingInterceptor implements Interceptor {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async intercept(request: HttpRequest, next: NextHandler): Promise<HttpResponse> {
    const startedAt = Date.now();
    this.logger.debug('http.request', { method: request.method, url: request.url });

    try {
      const response = await next(request);
      this.logger.debug('http.response', {
        method: request.method,
        url: request.url,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return response;
    } catch (error) {
      this.logger.warn('http.error', {
        method: request.method,
        url: request.url,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}