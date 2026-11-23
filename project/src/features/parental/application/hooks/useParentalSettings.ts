import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import { useActiveProfile, type MaturityRating } from '@/features/profiles';

import type { BlockedTitleInput } from '../../domain/entities/ParentalSettings';

export const parentalKeys = {
  settings: (profileId: string | null) => ['parental', profileId] as const,
};

/** profileId verilməsə aktiv profil götürülür. */
export function useParentalSettings(profileId?: string) {
  const { parental } = useServices();
  const { activeProfile } = useActiveProfile();
  const queryClient = useQueryClient();

  const id = profileId ?? activeProfile?.id ?? null;
  const key = parentalKeys.settings(id);

  const query = useQuery({
    queryKey: key,
    queryFn: () => parental.repository.get(id as string),
    enabled: id !== null,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const requireId = (): string => {
    if (!id) throw new Error('No profile selected');
    return id;
  };

  const setMax = useMutation({
    mutationFn: (rating: MaturityRating) => parental.setMaxMaturity.execute(requireId(), rating),
    onSuccess: invalidate,
  });

  const block = useMutation({
    mutationFn: (title: BlockedTitleInput) => parental.blockTitle.execute(requireId(), title),
    onSuccess: invalidate,
  });

  const unblock = useMutation({
    mutationFn: (titleId: string) => parental.unblockTitle.execute(requireId(), titleId),
    onSuccess: invalidate,
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    setMaxMaturity: setMax.mutateAsync,
    blockTitle: block.mutateAsync,
    unblockTitle: unblock.mutateAsync,
    isSaving: setMax.isPending || block.isPending || unblock.isPending,
    isBlocked: (titleId: string) =>
      query.data?.blockedTitles.some((item) => item.titleId === titleId) ?? false,
  };
}