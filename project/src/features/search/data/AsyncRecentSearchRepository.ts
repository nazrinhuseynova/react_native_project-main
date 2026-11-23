import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import {
  RECENT_SEARCHES_LIMIT,
  type RecentSearchRepository,
} from '../domain/repositories/RecentSearchRepository';

export class AsyncRecentSearchRepository implements RecentSearchRepository {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  async list(): Promise<string[]> {
    const stored = await readJson<unknown>(this.storage, storageKeys.recentSearches);
    if (!Array.isArray(stored)) return [];
    return stored.filter((value): value is string => typeof value === 'string');
  }

  async add(query: string): Promise<void> {
    const text = query.trim();
    if (!text) return;
    const current = await this.list();
    const next = [text, ...current.filter((item) => item.toLowerCase() !== text.toLowerCase())];
    await writeJson(this.storage, storageKeys.recentSearches, next.slice(0, RECENT_SEARCHES_LIMIT));
  }

  async remove(query: string): Promise<void> {
    const current = await this.list();
    await writeJson(
      this.storage,
      storageKeys.recentSearches,
      current.filter((item) => item !== query),
    );
  }

  clear(): Promise<void> {
    return this.storage.remove(storageKeys.recentSearches);
  }
}