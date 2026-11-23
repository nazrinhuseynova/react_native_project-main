import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeyValueStorage } from './KeyValueStorage';

export class AsyncStorageAdapter implements KeyValueStorage {
  private readonly prefix: string;

  constructor(prefix = 'cineverse:') {
    this.prefix = prefix;
  }

  getString(key: string): Promise<string | null> {
    return AsyncStorage.getItem(this.prefix + key);
  }

  setString(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(this.prefix + key, value);
  }

  remove(key: string): Promise<void> {
    return AsyncStorage.removeItem(this.prefix + key);
  }
}