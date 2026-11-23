import type { SupabaseClient } from '@supabase/supabase-js';

import type { Logger } from '@/core/logging/Logger';
import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';

export type TranslationStrings = Record<string, unknown>;

export type LanguageOption = {
  code: string;
  nativeName: string;
  version: number;
};

export type TranslationBundle = {
  version: number;
  strings: TranslationStrings;
};

type TranslationSourceDeps = {
  supabase: SupabaseClient;
  storage: KeyValueStorage;
  logger: Logger;
};

const TABLE = 'app_translations';
const LANGUAGES_KEY = 'i18n.languages';
const bundleKey = (code: string) => `i18n.bundle.${code}`;

export const FIRST_LOAD_TIMEOUT_MS = 3000;
export const BACKGROUND_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLanguageOption(value: unknown): value is LanguageOption {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.code === 'string' &&
    typeof value.nativeName === 'string' &&
    typeof value.version === 'number'
  );
}

export class TranslationSource {
  private readonly supabase: SupabaseClient;
  private readonly storage: KeyValueStorage;
  private readonly logger: Logger;

  constructor(deps: TranslationSourceDeps) {
    this.supabase = deps.supabase;
    this.storage = deps.storage;
    this.logger = deps.logger;
  }

  async readCachedLanguages(): Promise<LanguageOption[]> {
    const cached = await readJson<unknown>(this.storage, LANGUAGES_KEY);
    return Array.isArray(cached) ? cached.filter(isLanguageOption) : [];
  }

  async fetchLanguages(timeoutMs: number = FIRST_LOAD_TIMEOUT_MS): Promise<LanguageOption[] | null> {
    try {
      const { data, error } = await withTimeout(
        this.supabase
          .from(TABLE)
          .select('code, native_name, version')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('code', { ascending: true }),
        timeoutMs,
      );
      if (error) throw error;

      const list: LanguageOption[] = (data ?? []).map(
        (row: { code: unknown; native_name: unknown; version: unknown }) => ({
          code: String(row.code),
          nativeName: String(row.native_name),
          version: Number(row.version),
        }),
      );
      if (list.length === 0) return null;

      await writeJson(this.storage, LANGUAGES_KEY, list);
      return list;
    } catch (error) {
      this.logger.warn('i18n.languages_fetch_failed', { error: String(error) });
      return null;
    }
  }

  async readCachedBundle(code: string): Promise<TranslationBundle | null> {
    const cached = await readJson<unknown>(this.storage, bundleKey(code));
    if (!isPlainObject(cached)) return null;
    if (typeof cached.version !== 'number' || !isPlainObject(cached.strings)) return null;
    return { version: cached.version, strings: cached.strings };
  }

  async fetchBundle(
    code: string,
    timeoutMs: number = FIRST_LOAD_TIMEOUT_MS,
  ): Promise<TranslationBundle | null> {
    try {
      const { data, error } = await withTimeout(
        this.supabase
          .from(TABLE)
          .select('strings, version')
          .eq('code', code)
          .eq('is_active', true)
          .maybeSingle(),
        timeoutMs,
      );
      if (error) throw error;
      if (!data || !isPlainObject(data.strings)) return null;

      const bundle: TranslationBundle = { version: Number(data.version), strings: data.strings };
      await writeJson(this.storage, bundleKey(code), bundle);
      return bundle;
    } catch (error) {
      this.logger.warn('i18n.bundle_fetch_failed', { code, error: String(error) });
      return null;
    }
  }

  async loadBundle(code: string): Promise<TranslationBundle | null> {
    return (await this.readCachedBundle(code)) ?? (await this.fetchBundle(code));
  }
}