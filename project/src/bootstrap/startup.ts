import { initI18n, isSupportedLanguage } from '@/core/i18n/i18n';
import { storageKeys } from '@/core/storage/storageKeys';

import type { Services } from './container';
import { registerModules } from './registerModules';


export async function startup(services: Services): Promise<void> {
  registerModules(services);

  const storedLanguage = await services.storage.getString(storageKeys.language);
  await initI18n(isSupportedLanguage(storedLanguage) ? storedLanguage : undefined);
}