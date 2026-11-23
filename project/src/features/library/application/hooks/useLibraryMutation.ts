import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { NotFoundError } from '@/core/errors/NotFoundError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import type { TitleId } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';
import { useToast } from '@/shared/ui/ToastProvider';

import { patchEntries, type EntryPatch, type LibraryEntry } from '../../domain/entities/LibraryEntry';
import { libraryKeys } from '../libraryKeys';

type Variables<TValue> = { titleId: TitleId; value: TValue };

type Options<TValue> = {
  run: (profileId: string, titleId: TitleId, value: TValue) => Promise<unknown>;
  toPatch: (value: TValue) => EntryPatch;
};

export function useLibraryMutation<TValue>({ run, toPatch }: Options<TValue>) {
  const { activeProfile } = useActiveProfile();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  const profileId = activeProfile?.id ?? null;
  const key = libraryKeys.list(profileId);

  return useMutation<unknown, unknown, Variables<TValue>, { previous?: LibraryEntry[] }>({
    mutationFn: ({ titleId, value }) => {
      if (!profileId) throw new NotFoundError('No active profile', { resource: 'profile' });
      return run(profileId, titleId, value);
    },
    onMutate: async ({ titleId, value }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<LibraryEntry[]>(key);
      queryClient.setQueryData<LibraryEntry[]>(key, (current = []) =>
        patchEntries(current, titleId, toPatch(value)),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error(t(toUserMessage(error)));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}