import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useTitlesByIds, type Title } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';

import { progressFraction, type WatchProgress } from '../../domain/entities/WatchProgress';
import { historyKeys } from '../historyKey';

const EMPTY: WatchProgress[] = [];

export type ContinueWatchingEntry = {
  progress: WatchProgress;
  title: Title;
  fraction: number;
};

export function useContinueWatching() {
  const { history } = useServices();
  const { activeProfile } = useActiveProfile();
  const profileId = activeProfile?.id ?? null;

  const query = useQuery({
    queryKey: historyKeys.continue(profileId),
    queryFn: () => history.getContinueWatching.execute(profileId as string),
    enabled: profileId !== null,
  });

  const progress = query.data ?? EMPTY;
  const ids = useMemo(() => progress.map((item) => item.titleId), [progress]);
  const { titles, isLoading: titlesLoading } = useTitlesByIds(ids);

  const items = useMemo<ContinueWatchingEntry[]>(() => {
    const byId = new Map(titles.map((title) => [title.id, title] as const));
    return progress.flatMap((item) => {
      const title = byId.get(item.titleId);
      return title ? [{ progress: item, title, fraction: progressFraction(item) }] : [];
    });
  }, [progress, titles]);

  return { items, isLoading: query.isLoading || titlesLoading, refetch: query.refetch };
}