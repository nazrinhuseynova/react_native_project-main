import { useQuery } from '@tanstack/react-query';

import { useServices } from '@/bootstrap/useServices';
import type { TitleId } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';

import { progressFraction } from '../../domain/entities/WatchProgress';
import { historyKeys } from '../historyKey';

export function useTitleProgress(titleId: TitleId | null) {
  const { history } = useServices();
  const { activeProfile } = useActiveProfile();
  const profileId = activeProfile?.id ?? null;

  const query = useQuery({
    queryKey: historyKeys.progress(profileId, titleId),
    queryFn: () => history.repository.find(profileId as string, titleId as TitleId),
    enabled: profileId !== null && titleId !== null,
  });

  const progress = query.data ?? null;

  return {
    progress,
    fraction: progress ? progressFraction(progress) : null,
    positionSec: progress?.positionSec ?? 0,
    isCompleted: progress?.completedAt != null,
    isLoading: query.isLoading,
  };
}