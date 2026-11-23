import { useCallback } from 'react';

import { useServices } from '@/bootstrap/useServices';
import type { TitleId } from '@/features/catalog';

import { DEFAULT_WATCH_STATUS, type WatchStatus } from '../../domain/entities/WatchStatus';
import { useLibrary } from './useLibrary';
import { useLibraryMutation } from './useLibraryMutation';

export function useWatchStatus() {
  const { library } = useServices();
  const { byId } = useLibrary();

  const mutation = useLibraryMutation<WatchStatus>({
    run: (profileId, titleId, status) => library.setWatchStatus.execute(profileId, titleId, status),
    toPatch: (watchStatus) => ({ watchStatus }),
  });
  const { mutate } = mutation;

  const statusOf = useCallback(
    (titleId: TitleId): WatchStatus => byId.get(titleId)?.watchStatus ?? DEFAULT_WATCH_STATUS,
    [byId],
  );
  const set = useCallback(
    (titleId: TitleId, status: WatchStatus) => mutate({ titleId, value: status }),
    [mutate],
  );

  return { statusOf, set, isPending: mutation.isPending };
}