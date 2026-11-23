import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { type PropsWithChildren, useEffect, useState } from 'react';

import { createPersistOptions, createQueryPersister } from '@/core/query/asyncPersister';
import { AuthProvider } from '@/features/auth';
import { DownloadsProvider } from '@/features/downloads';
import { ProfileProvider } from '@/features/profiles';
import { SettingsProvider, useThemePreference } from '@/features/settings';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { ToastProvider } from '@/shared/ui/ToastProvider';

import { createServices } from './container';
import { ServicesProvider } from './ServicesProvider';
import { startup } from './startup';

const services = createServices();
const persistOptions = createPersistOptions(createQueryPersister(services.storage));


function ThemedProviders({ children }: PropsWithChildren) {
  const { preference } = useThemePreference();

  return (
    <ThemeProvider preference={preference}>
      <AuthProvider>
        <ProfileProvider>
          <ToastProvider>
            <DownloadsProvider>{children}</DownloadsProvider>
          </ToastProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    let active = true;

    startup(services)
      .catch((error: unknown) => {
        services.logger.error('startup.failed', { error: String(error) });
      })
      .finally(() => {
        if (active) setIsStarted(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isStarted) return null;

  return (
    <PersistQueryClientProvider client={services.queryClient} persistOptions={persistOptions}>
      <ServicesProvider services={services}>
        <SettingsProvider>
          <ThemedProviders>{children}</ThemedProviders>
        </SettingsProvider>
      </ServicesProvider>
    </PersistQueryClientProvider>
  );
}