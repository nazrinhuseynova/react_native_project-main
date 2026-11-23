import type { SecureStorage } from './SecureStorage';

export class InMemoryStorage implements SecureStorage {
  readonly secure = true as const;
  private readonly values = new Map<string, string>();

  async getString(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async setString(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.values.delete(key);
  }
}