import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useTitlesByIds, type Title } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';

import type { WatchProgress } from '../../domain/entities/WatchProgress';
import { historyKeys } from '../historyKey';

const EMPTY: WatchProgress[] = [];
const MAX_WATCHED = 100;

export type WatchedItem = {
  progress: WatchProgress;
  title: Title;
};

export function useWatchedTitles() {
  const { history } = useServices();
  const { activeProfile } = useActiveProfile();
  const profileId = activeProfile?.id ?? null;

  const query = useQuery({
    queryKey: historyKeys.watched(profileId),
    queryFn: () => history.getWatched.execute(profileId as string),
    enabled: profileId !== null,
  });

  const progress = useMemo(() => (query.data ?? EMPTY).slice(0, MAX_WATCHED), [query.data]);
  const ids = useMemo(() => progress.map((item) => item.titleId), [progress]);
  const { titles, isLoading: titlesLoading } = useTitlesByIds(ids);

  const items = useMemo<WatchedItem[]>(() => {
    const byId = new Map(titles.map((title) => [title.id, title] as const));
    return progress.flatMap((item) => {
      const title = byId.get(item.titleId);
      return title ? [{ progress: item, title }] : [];
    });
  }, [progress, titles]);

  return {
    items,
    isLoading: query.isLoading || (progress.length > 0 && titlesLoading && items.length === 0),
    isError: query.isError,
    refetch: query.refetch,
  };
}