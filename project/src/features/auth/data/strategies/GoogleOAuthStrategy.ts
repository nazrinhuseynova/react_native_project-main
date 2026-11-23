import type { SupabaseClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { AuthError } from '@/core/errors/AuthError';

import type { Session } from '../../domain/entities/Session';
import {
  createCancelledError,
  type AuthStrategy,
  type SignInCredentials,
} from '../../domain/strategies/AuthStrategy';
import { toAuthError, toSession } from '../mappers/sessionMapper';

const REDIRECT_PATH = 'auth/callback';

function readParams(url: string): URLSearchParams {
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');
  const query =
    queryIndex >= 0 ? url.slice(queryIndex + 1, hashIndex > queryIndex ? hashIndex : undefined) : '';
  const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';

  const params = new URLSearchParams(query);
  new URLSearchParams(fragment).forEach((value, key) => params.set(key, value));
  return params;
}

export class GoogleOAuthStrategy implements AuthStrategy {
  readonly id = 'google' as const;
  readonly kind = 'google' as const;
  readonly order = 20;
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async signIn(credentials: SignInCredentials): Promise<Session> {
    if (credentials.kind !== 'google') {
      throw new AuthError('Unsupported credentials', { reason: 'unknown' });
    }

    const redirectTo = Linking.createURL(REDIRECT_PATH);

    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw toAuthError(error);
    if (!data.url) throw new AuthError('OAuth URL is missing', { reason: 'unknown' });

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') throw createCancelledError();

    const params = readParams(result.url);
    const providerError = params.get('error_description') ?? params.get('error');
    if (providerError) throw new AuthError(providerError, { reason: 'unauthorized' });

    const code = params.get('code');
    if (code) {
      const exchanged = await this.client.auth.exchangeCodeForSession(code);
      if (exchanged.error) throw toAuthError(exchanged.error);
      if (!exchanged.data.session) throw new AuthError('No session', { reason: 'unknown' });
      return toSession(exchanged.data.session);
    }

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) {
      throw new AuthError('OAuth callback has no tokens', { reason: 'unknown' });
    }

    const { data: sessionData, error: sessionError } = await this.client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (sessionError) throw toAuthError(sessionError);
    if (!sessionData.session) throw new AuthError('No session', { reason: 'unknown' });
    return toSession(sessionData.session);
  }
}