import { isSupportedLanguage, resolveDeviceLanguage } from '@/core/i18n/i18n';
import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import { createDefaultSettings, sanitizeSettings, type AppSettings } from '../domain/entities/AppSettings';
import type { SettingsRepository } from '../domain/repositories/SettingsRepository';

export class AsyncSettingsRepository implements SettingsRepository {
  private readonly storage: KeyValueStorage;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  async load(): Promise<AppSettings> {
    const storedLanguage = await this.storage.getString(storageKeys.language);
    const language = isSupportedLanguage(storedLanguage) ? storedLanguage : resolveDeviceLanguage();
    const stored = await readJson<unknown>(this.storage, storageKeys.settings);
    return sanitizeSettings(stored, createDefaultSettings(language));
  }

  async save(settings: AppSettings): Promise<void> {
    await writeJson(this.storage, storageKeys.settings, settings);
    // startup.ts dili bu açardan oxuyur.
    await this.storage.setString(storageKeys.language, settings.language);
  }
}