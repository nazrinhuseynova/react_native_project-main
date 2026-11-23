import { initI18n } from '@/core/i18n/i18n';
import { storageKeys } from '@/core/storage/storageKeys';

import type { Services } from './container';
import { registerModules } from './registerModules';


export async function startup(services: Services): Promise<void> {
  registerModules(services);

  await initI18n({
    supabase: services.supabase,
    storage: services.storage,
    logger: services.logger,
    language: await services.storage.getString(storageKeys.language),
  });
}