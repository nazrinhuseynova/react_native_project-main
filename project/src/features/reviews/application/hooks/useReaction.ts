import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useAuth } from '@/features/auth';
import type { TitleId } from '@/features/catalog';
import { useToast } from '@/shared/ui/ToastProvider';

import type { Reaction } from '../../domain/entities/Reaction';
import { toErrorKey } from '../errorKey';
import { reviewKeys } from '../reviewKeys';

export function useReaction(titleId: TitleId) {
  const { reviews } = useServices();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  const userId = session?.user.id ?? null;
  const key = reviewKeys.reaction(userId, titleId);

  const query = useQuery({
    queryKey: key,
    queryFn: () => reviews.reactions.get(userId as string, titleId),
    enabled: userId !== null,
  });
  const reaction = query.data ?? null;

  const mutation = useMutation<void, unknown, Reaction | null, { previous?: Reaction | null }>({
    mutationFn: async (next) => {
      if (!userId) return;
      await reviews.setReaction.execute(userId, titleId, next);
    },
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Reaction | null>(key);
      queryClient.setQueryData<Reaction | null>(key, next);
      return { previous };
    },
    onError: (error, _next, context) => {
      queryClient.setQueryData(key, context?.previous ?? null);
      toast.error(t(toErrorKey(error)));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  const { mutate } = mutation;

  /** Eyni reaksiyaya yenidən basmaq onu silir. */
  const select = useCallback((next: Reaction) => mutate(reaction === next ? null : next), [mutate, reaction]);

  return { reaction, select, isPending: mutation.isPending };
}