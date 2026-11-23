import { useCallback } from 'react';

import { useServices } from '@/bootstrap/useServices';
import type { TitleId } from '@/features/catalog';

import { useLibrary } from './useLibrary';
import { useLibraryMutation } from './useLibraryMutation';

export function useToggleFavorite() {
  const { library } = useServices();
  const { byId } = useLibrary();

  const mutation = useLibraryMutation<boolean>({
    run: (profileId, titleId, favorite) =>
      library.toggleFavorite.execute(profileId, titleId, favorite),
    toPatch: (favorite) => ({ favorite }),
  });
  const { mutate } = mutation;

  const isFavorite = useCallback((titleId: TitleId) => byId.get(titleId)?.favorite ?? false, [byId]);
  const set = useCallback(
    (titleId: TitleId, favorite: boolean) => mutate({ titleId, value: favorite }),
    [mutate],
  );
  const toggle = useCallback(
    (titleId: TitleId) => mutate({ titleId, value: !(byId.get(titleId)?.favorite ?? false) }),
    [mutate, byId],
  );

  return { isFavorite, set, toggle, isPending: mutation.isPending };
}