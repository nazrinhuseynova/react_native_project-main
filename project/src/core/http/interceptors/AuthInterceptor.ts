import type { Interceptor, NextHandler } from '../Interceptor';
import type { HttpRequest, HttpResponse } from '../types';

export type TokenProvider = () => Promise<string | null> | string | null;

export type AuthInterceptorOptions = {
  headerName?: string;
  scheme?: string;
};

export class AuthInterceptor implements Interceptor {
  private readonly getToken: TokenProvider;
  private readonly headerName: string;
  private readonly scheme: string;

  constructor(getToken: TokenProvider, options: AuthInterceptorOptions = {}) {
    this.getToken = getToken;
    this.headerName = options.headerName ?? 'Authorization';
    this.scheme = options.scheme ?? 'Bearer';
  }

  async intercept(request: HttpRequest, next: NextHandler): Promise<HttpResponse> {
    if (request.headers[this.headerName]) return next(request);

    const token = await this.getToken();
    if (!token) return next(request);

    const value = this.scheme ? `${this.scheme} ${token}` : token;
    return next({ ...request, headers: { ...request.headers, [this.headerName]: value } });
  }
}