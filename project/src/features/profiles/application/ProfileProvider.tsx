import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { useServices } from '@/bootstrap/useServices';
import { storageKeys } from '@/core/storage/storageKeys';
import { useAuth } from '@/features/auth';

import type { Profile } from '../domain/entities/Profile';
import { profileKeys } from './profileKeys';

export type ProfileContextValue = {
  isReady: boolean;
  profiles: Profile[];
  activeProfile: Profile | null;
  switchProfile(profileId: string): Promise<Profile>;
  clearActiveProfile(): Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

const EMPTY: Profile[] = [];

export function ProfileProvider({ children }: PropsWithChildren) {
  const { profiles: service, storage, eventBus, logger } = useServices();
  const { session, isReady: authReady } = useAuth();
  const userId = session?.user.id ?? null;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let active = true;
    storage
      .getString(storageKeys.activeProfileId)
      .then((stored) => {
        if (active) setActiveId(stored);
      })
      .catch((error: unknown) => logger.warn('profiles.restore_failed', { error: String(error) }))
      .finally(() => {
        if (active) setStorageReady(true);
      });
    return () => {
      active = false;
    };
  }, [storage, logger]);

  useEffect(
    () =>
      eventBus.on('auth.signedOut', () => {
        setActiveId(null);
        service.switch.clear().catch(() => undefined);
      }),
    [eventBus, service],
  );

  const query = useQuery({
    queryKey: profileKeys.list(userId),
    queryFn: () => service.repository.list(),
    enabled: userId !== null,
  });

  const profiles = query.data ?? EMPTY;

  const activeProfile = useMemo(
    () => (userId && activeId ? (profiles.find((profile) => profile.id === activeId) ?? null) : null),
    [userId, activeId, profiles],
  );


  useEffect(() => {
    if (query.isSuccess && activeId && !profiles.some((profile) => profile.id === activeId)) {
      setActiveId(null);
      service.switch.clear().catch(() => undefined);
    }
  }, [query.isSuccess, activeId, profiles, service]);

  const switchProfile = useCallback(
    async (profileId: string) => {
      const profile = await service.switch.execute(profileId);
      setActiveId(profile.id);
      return profile;
    },
    [service],
  );

  const clearActiveProfile = useCallback(async () => {
    await service.switch.clear();
    setActiveId(null);
  }, [service]);

  const isReady = authReady && storageReady && (userId === null || !query.isLoading);

  const value = useMemo<ProfileContextValue>(
    () => ({ isReady, profiles, activeProfile, switchProfile, clearActiveProfile }),
    [isReady, profiles, activeProfile, switchProfile, clearActiveProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}