import { HTTP_TIMEOUT_MS } from '@/core/config/constants';
import { NetworkError } from '@/core/errors/NetworkError';

import type { HttpClient } from './HttpClient';
import type { Interceptor, NextHandler } from './Interceptor';
import type {
  HttpHeaders,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  QueryParams,
  RequestOptions,
} from './types';

export type FetchHttpClientOptions = {
  baseUrl?: string;
  defaultHeaders?: HttpHeaders;
  timeoutMs?: number;
  interceptors?: Interceptor[];
  fetchImpl?: typeof fetch;
};

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HttpHeaders;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly handler: NextHandler;

  constructor(options: FetchHttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '';
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.timeoutMs = options.timeoutMs ?? HTTP_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? ((input, init) => fetch(input, init));

    const terminal: NextHandler = (request) => this.send(request);
    this.handler = (options.interceptors ?? []).reduceRight<NextHandler>(
      (next, interceptor) => (request) => interceptor.intercept(request, next),
      terminal,
    );
  }

  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', url, body, options);
  }

  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', url, body, options);
  }

  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', url, body, options);
  }

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const request: HttpRequest = {
      url: this.resolveUrl(url),
      method,
      headers: { ...this.defaultHeaders, ...options?.headers },
      query: options?.query,
      body,
      signal: options?.signal,
      timeoutMs: options?.timeoutMs ?? this.timeoutMs,
    };
    const response = await this.handler(request);
    return response.data as T;
  }

  private resolveUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url;
    const base = this.baseUrl.replace(/\/+$/, '');
    const path = url.replace(/^\/+/, '');
    return base ? `${base}/${path}` : path;
  }

  private async send(request: HttpRequest): Promise<HttpResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), request.timeoutMs ?? this.timeoutMs);
    const forwardAbort = () => controller.abort();

    if (request.signal) {
      if (request.signal.aborted) {
        controller.abort();
      } else {
        request.signal.addEventListener('abort', forwardAbort, { once: true });
      }
    }

    try {
      const hasBody = request.body !== undefined && request.method !== 'GET';
      const headers: HttpHeaders = {
        Accept: 'application/json',
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...request.headers,
      };

      const response = await this.fetchImpl(buildUrl(request.url, request.query), {
        method: request.method,
        headers,
        body: hasBody ? JSON.stringify(request.body) : undefined,
        signal: controller.signal,
      });

      const data = await readBody(response);

      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}`, {
          reason: 'http',
          status: response.status,
          details: { data, retryAfter: response.headers.get('retry-after') },
        });
      }

      return { status: response.status, headers: headersToRecord(response.headers), data };
    } catch (error) {
      throw toNetworkError(error, request);
    } finally {
      clearTimeout(timeoutId);
      request.signal?.removeEventListener('abort', forwardAbort);
    }
  }
}

function buildUrl(url: string, query?: QueryParams): string {
  if (!query) return url;
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  if (!params) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${params}`;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function headersToRecord(headers: Headers): HttpHeaders {
  const record: HttpHeaders = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function toNetworkError(error: unknown, request: HttpRequest): NetworkError {
  if (error instanceof NetworkError) return error;
  if (request.signal?.aborted) {
    return new NetworkError('Request aborted', { reason: 'aborted', cause: error });
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return new NetworkError('Request timed out', { reason: 'timeout', cause: error });
  }
  return new NetworkError('Network request failed', { reason: 'offline', cause: error });
}