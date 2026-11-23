import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useActiveProfile } from '@/features/profiles';

import type { LibraryEntry } from '../../domain/entities/LibraryEntry';
import { libraryKeys } from '../libraryKeys';

const EMPTY: LibraryEntry[] = [];

export function useLibrary() {
  const { library } = useServices();
  const { activeProfile } = useActiveProfile();
  const profileId = activeProfile?.id ?? null;

  const query = useQuery({
    queryKey: libraryKeys.list(profileId),
    queryFn: () => library.repository.list(profileId as string),
    enabled: profileId !== null,
  });

  const entries = query.data ?? EMPTY;
  const byId = useMemo(() => new Map(entries.map((entry) => [entry.titleId, entry] as const)), [entries]);

  return {
    profileId,
    entries,
    byId,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}