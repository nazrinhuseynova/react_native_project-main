import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { LargeSecureStore } from './LargeSecureStore';

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  const client = createClient(config.url, config.anonKey, {
    auth: {
      storage: new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      client.auth.startAutoRefresh();
    } else {
      client.auth.stopAutoRefresh();
    }
  });

  return client;
}