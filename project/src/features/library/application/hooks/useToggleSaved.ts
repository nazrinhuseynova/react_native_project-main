import { useCallback } from 'react';

import { useServices } from '@/bootstrap/useServices';
import type { TitleId } from '@/features/catalog';

import { useLibrary } from './useLibrary';
import { useLibraryMutation } from './useLibraryMutation';

export function useToggleSaved() {
  const { library } = useServices();
  const { byId } = useLibrary();

  const mutation = useLibraryMutation<boolean>({
    run: (profileId, titleId, saved) => library.toggleSaved.execute(profileId, titleId, saved),
    toPatch: (saved) => ({ saved }),
  });
  const { mutate } = mutation;

  const isSaved = useCallback((titleId: TitleId) => byId.get(titleId)?.saved ?? false, [byId]);
  const set = useCallback(
    (titleId: TitleId, saved: boolean) => mutate({ titleId, value: saved }),
    [mutate],
  );
  const toggle = useCallback(
    (titleId: TitleId) => mutate({ titleId, value: !(byId.get(titleId)?.saved ?? false) }),
    [mutate, byId],
  );

  return { isSaved, set, toggle, isPending: mutation.isPending };
}