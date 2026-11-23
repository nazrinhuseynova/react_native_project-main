import type { AppSettings } from '../entities/AppSettings';

export interface SettingsRepository {
  load(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
}