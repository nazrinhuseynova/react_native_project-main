import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import az from './locales/az.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = ['az', 'en', 'ru'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function resolveDeviceLanguage(): AppLanguage {
  const code = getLocales()[0]?.languageCode;
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
}

export async function initI18n(language?: AppLanguage): Promise<typeof i18n> {
  if (i18n.isInitialized) {
    if (language && i18n.language !== language) await i18n.changeLanguage(language);
    return i18n;
  }

  await i18n.use(initReactI18next).init({
    resources: {
      az: { translation: az },
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: language ?? resolveDeviceLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
  });

  return i18n;
}

export function changeLanguage(language: AppLanguage): Promise<unknown> {
  return i18n.changeLanguage(language);
}

export { i18n };