export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpHeaders = Record<string, string>;

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export type HttpRequest = {
  url: string;
  method: HttpMethod;
  headers: HttpHeaders;
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type HttpResponse<T = unknown> = {
  status: number;
  headers: HttpHeaders;
  data: T;
};

export type RequestOptions = {
  headers?: HttpHeaders;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
};