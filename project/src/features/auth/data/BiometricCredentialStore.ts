import type { SecureStorage } from '@/core/storage/SecureStorage';
import { storageKeys } from '@/core/storage/storageKeys';

/** Biometrik giriş üçün refresh token yalnız SecureStore-da saxlanır. */
export class BiometricCredentialStore {
  private readonly storage: SecureStorage;

  constructor(storage: SecureStorage) {
    this.storage = storage;
  }

  save(refreshToken: string): Promise<void> {
    return this.storage.setString(storageKeys.biometricRefreshToken, refreshToken);
  }

  read(): Promise<string | null> {
    return this.storage.getString(storageKeys.biometricRefreshToken);
  }

  async has(): Promise<boolean> {
    return (await this.read()) !== null;
  }

  clear(): Promise<void> {
    return this.storage.remove(storageKeys.biometricRefreshToken);
  }
}