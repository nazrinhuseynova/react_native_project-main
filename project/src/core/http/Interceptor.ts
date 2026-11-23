import type { HttpRequest, HttpResponse } from './types';

export type NextHandler = (request: HttpRequest) => Promise<HttpResponse>;

export interface Interceptor {
  intercept(request: HttpRequest, next: NextHandler): Promise<HttpResponse>;
}