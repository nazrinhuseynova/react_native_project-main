import * as SecureStore from 'expo-secure-store';

import type { SecureStorage } from './SecureStorage';

export class SecureStoreAdapter implements SecureStorage {
  readonly secure = true as const;
  private readonly prefix: string;

  constructor(prefix = 'cineverse.') {
    this.prefix = prefix;
  }

  getString(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(this.prefix + key);
  }

  setString(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(this.prefix + key, value);
  }

  remove(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(this.prefix + key);
  }
}