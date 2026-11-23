import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/core/i18n/i18n';
import type { DownloadQuality } from '@/features/downloads';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DOWNLOAD_QUALITY_OPTIONS = ['standard', 'high'] as const satisfies readonly DownloadQuality[];
export const FOR_YOU_LIMITS_GB = [1, 2, 5, 10] as const;

export type AppSettings = {
  theme: ThemePreference;
  language: AppLanguage;
  notifications: boolean;
  dataSaver: boolean;
  autoplay: boolean;
  uiSounds: boolean;
  downloadQuality: DownloadQuality;
  wifiOnlyDownloads: boolean;
  smartDownloads: boolean;
  downloadsForYouGb: number;
};

export function createDefaultSettings(language: AppLanguage): AppSettings {
  return {
    theme: 'dark',
    language,
    notifications: true,
    dataSaver: false,
    autoplay: true,
    uiSounds: false,
    downloadQuality: 'standard',
    wifiOnlyDownloads: true,
    smartDownloads: false,
    downloadsForYouGb: 2,
  };
}


export function sanitizeSettings(raw: unknown, fallback: AppSettings): AppSettings {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const flag = (value: unknown, defaultValue: boolean) =>
    typeof value === 'boolean' ? value : defaultValue;

  return {
    theme: THEME_PREFERENCES.find((item) => item === source.theme) ?? fallback.theme,
    language: SUPPORTED_LANGUAGES.find((item) => item === source.language) ?? fallback.language,
    notifications: flag(source.notifications, fallback.notifications),
    dataSaver: flag(source.dataSaver, fallback.dataSaver),
    autoplay: flag(source.autoplay, fallback.autoplay),
    uiSounds: flag(source.uiSounds, fallback.uiSounds),
    downloadQuality:
      DOWNLOAD_QUALITY_OPTIONS.find((item) => item === source.downloadQuality) ??
      fallback.downloadQuality,
    wifiOnlyDownloads: flag(source.wifiOnlyDownloads, fallback.wifiOnlyDownloads),
    smartDownloads: flag(source.smartDownloads, fallback.smartDownloads),
    downloadsForYouGb:
      FOR_YOU_LIMITS_GB.find((item) => item === source.downloadsForYouGb) ??
      fallback.downloadsForYouGb,
  };
}