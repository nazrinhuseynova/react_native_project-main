import { createContext, type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { changeLanguage, DEFAULT_LANGUAGE, i18n } from '@/core/i18n/i18n';

import { createDefaultSettings, type AppSettings } from '../domain/entities/AppSettings';

export type SettingsContextValue = {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
};

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const { settings: service, logger } = useServices();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const settingsRef = useRef<AppSettings | null>(null);

  useEffect(() => {
    let active = true;

    service.repository
      .load()
      .catch((error: unknown) => {
        logger.warn('settings.load_failed', { error: String(error) });
        return createDefaultSettings(DEFAULT_LANGUAGE);
      })
      .then((loaded) => {
        if (!active) return;
        settingsRef.current = loaded;
        setSettings(loaded);
        if (i18n.language !== loaded.language) void changeLanguage(loaded.language);
      });

    return () => {
      active = false;
    };
  }, [service, logger]);

  const commit = (next: AppSettings, previous: AppSettings) => {
    settingsRef.current = next;
    setSettings(next);
    if (next.language !== previous.language) void changeLanguage(next.language);
    service.repository.save(next).catch((error: unknown) => {
      logger.warn('settings.save_failed', { error: String(error) });
    });
  };

  const update = (patch: Partial<AppSettings>) => {
    const previous = settingsRef.current;
    if (previous) commit({ ...previous, ...patch }, previous);
  };

  const reset = () => {
    const previous = settingsRef.current;
    if (previous) commit(createDefaultSettings(previous.language), previous);
  };

  
  if (!settings) return null;

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}