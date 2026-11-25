import type { SupabaseClient } from '@supabase/supabase-js';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Logger } from '@/core/logging/Logger';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';

import en from './locales/en.json';
import {
  BACKGROUND_TIMEOUT_MS,
  TranslationSource,
  type LanguageOption,
  type TranslationBundle,
  type TranslationStrings,
} from './TranslationSource';

export type { LanguageOption };

export type AppLanguage = string;

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

const FALLBACK_LANGUAGES: LanguageOption[] = [
  { code: DEFAULT_LANGUAGE, nativeName: 'English', version: 0 },
];

let source: TranslationSource | null = null;
let logger: Logger | null = null;
let languages: LanguageOption[] = FALLBACK_LANGUAGES;
const listeners = new Set<() => void>();

function setLanguages(next: LanguageOption[]): void {
  languages = next.some((item) => item.code === DEFAULT_LANGUAGE)
    ? next
    : [...FALLBACK_LANGUAGES, ...next];
  listeners.forEach((listener) => listener());
}

export function getAvailableLanguages(): LanguageOption[] {
  return languages;
}

export function subscribeAvailableLanguages(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  return !!value && languages.some((item) => item.code === value);
}

export function resolveDeviceLanguage(): AppLanguage {
  const code = getLocales()[0]?.languageCode;
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
}

function isObj(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** base üzərinə override yazır; override-da olmayan açarlar (məs. yeni ekranların mətnləri) base-dən qalır. */
function deepMerge(base: TranslationStrings, override: TranslationStrings): TranslationStrings {
  const out: TranslationStrings = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] = isObj(current) && isObj(value) ? deepMerge(current, value) : value;
  }
  return out;
}

function applyBundle(code: string, bundle: TranslationBundle): void {
  i18n.addResourceBundle(code, 'translation', bundle.strings, true, true);
}

async function syncFromServer(): Promise<void> {
  if (!source) return;

  try {
    const fresh = await source.fetchLanguages(BACKGROUND_TIMEOUT_MS);
    if (!fresh) return;
    setLanguages(fresh);

    let updated = false;
    for (const code of new Set([DEFAULT_LANGUAGE, i18n.language])) {
      const remote = fresh.find((item) => item.code === code);
      if (!remote) continue;

      const cached = await source.readCachedBundle(code);
      if (cached && cached.version >= remote.version) continue;

      const bundle = await source.fetchBundle(code, BACKGROUND_TIMEOUT_MS);
      if (bundle) {
        applyBundle(code, bundle);
        updated = true;
      }
    }

    if (updated) await i18n.changeLanguage(i18n.language);
  } catch (error) {
    logger?.warn('i18n.sync_failed', { error: String(error) });
  }
}

export type InitI18nOptions = {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  logger: Logger;
  language?: string | null;
};

export async function initI18n(options: InitI18nOptions): Promise<typeof i18n> {
  if (i18n.isInitialized) {
    if (options.language && i18n.language !== options.language) {
      await changeLanguage(options.language);
    }
    return i18n;
  }

  logger = options.logger;
  source = new TranslationSource({
    supabase: options.supabase,
    storage: options.storage,
    logger: options.logger,
  });

  const cachedLanguages = await source.readCachedLanguages();
  if (cachedLanguages.length > 0) {
    setLanguages(cachedLanguages);
  } else {
    const fetched = await source.fetchLanguages();
    if (fetched) setLanguages(fetched);
  }

  const wanted = isSupportedLanguage(options.language) ? options.language : resolveDeviceLanguage();

  const cachedDefault = await source.readCachedBundle(DEFAULT_LANGUAGE);
  const resources: Record<string, { translation: TranslationStrings }> = {
    [DEFAULT_LANGUAGE]: {
      translation: cachedDefault ? deepMerge(en, cachedDefault.strings) : en,
    },
  };

  let lng: AppLanguage = wanted;
  if (wanted !== DEFAULT_LANGUAGE) {
    const bundle = await source.loadBundle(wanted);
    if (bundle) resources[wanted] = { translation: deepMerge(en, bundle.strings) };
    else lng = DEFAULT_LANGUAGE;
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
  });

  void syncFromServer();

  return i18n;
}

export async function changeLanguage(language: AppLanguage): Promise<boolean> {
  if (!i18n.hasResourceBundle(language, 'translation')) {
    const bundle = source ? await source.loadBundle(language) : null;
    if (!bundle) {
      logger?.warn('i18n.bundle_unavailable', { language });
      return false;
    }
    applyBundle(language, bundle);
  }

  await i18n.changeLanguage(language);
  void syncFromServer();
  return true;
}

export { i18n };