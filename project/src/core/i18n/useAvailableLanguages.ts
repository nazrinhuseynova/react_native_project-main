import { useSyncExternalStore } from 'react';

import {
  getAvailableLanguages,
  subscribeAvailableLanguages,
  type LanguageOption,
} from './i18n';

export function useAvailableLanguages(): LanguageOption[] {
  return useSyncExternalStore(
    subscribeAvailableLanguages,
    getAvailableLanguages,
    getAvailableLanguages,
  );
}