import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import type { OnboardingRepository } from '../domain/OnboardingRepository';

const SEEN_VALUE = 'true';

export class AsyncOnboardingRepository implements OnboardingRepository {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  async hasSeen(): Promise<boolean> {
    return (await this.storage.getString(storageKeys.onboardingSeen)) === SEEN_VALUE;
  }

  markSeen(): Promise<void> {
    return this.storage.setString(storageKeys.onboardingSeen, SEEN_VALUE);
  }

  async getGenres(): Promise<number[]> {
    const stored = await readJson<unknown>(this.storage, storageKeys.onboardingGenres);
    if (!Array.isArray(stored)) return [];
    return stored.filter((value): value is number => typeof value === 'number');
  }

  saveGenres(ids: readonly number[]): Promise<void> {
    return writeJson(this.storage, storageKeys.onboardingGenres, [...new Set(ids)]);
  }

  async reset(): Promise<void> {
    await Promise.all([
      this.storage.remove(storageKeys.onboardingSeen),
      this.storage.remove(storageKeys.onboardingGenres),
    ]);
  }
}