import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useGenres, type Title, type TitleId } from '@/features/catalog';
import { useContentFilter } from '@/features/parental';
import { useActiveProfile } from '@/features/profiles';

import { categoryKey, type CategoryFilter } from '../../domain/CategoryFilter';
import { homeKeys } from '../homeKeys';

const HERO_POOL_SIZE = 8;
const HERO_ROTATION_MS = 6 * 60 * 60 * 1000;
const MAX_HERO_GENRES = 3;

export function useHeroTitle(category: CategoryFilter) {
  const { catalog, home, eventBus, analytics } = useServices();
  const { activeProfile } = useActiveProfile();
  const { i18n } = useTranslation();
  const { filter } = useContentFilter();
  const { names } = useGenres();
  const queryClient = useQueryClient();

  const profileId = activeProfile?.id ?? null;
  const isKids = activeProfile?.isKids ?? false;
  const variant = `${categoryKey(category)}:${isKids ? 'kids' : 'standard'}`;

  const candidates = useQuery({
    queryKey: homeKeys.hero(profileId, i18n.language, variant),
    enabled: profileId !== null,
    queryFn: async (): Promise<Title[]> => {
      if (isKids) return (await catalog.discover.kidsSafe('movie')).items;
      if (category.kind === 'genre') return (await catalog.discover.byGenre('movie', category.genreId)).items;
      return (await catalog.discover.trending(category.kind, 'day')).items;
    },
  });

  const title = useMemo(() => {
    const pool = filter(candidates.data ?? [])
      .filter((item) => item.poster || item.backdrop)
      .slice(0, HERO_POOL_SIZE);
    if (pool.length === 0) return null;
    return pool[Math.floor(Date.now() / HERO_ROTATION_MS) % pool.length] ?? null;
  }, [candidates.data, filter]);

  const genreNames = useMemo(
    () =>
      (title?.genreIds ?? [])
        .slice(0, MAX_HERO_GENRES)
        .map((id) => names[id])
        .filter((name): name is string => !!name),
    [title, names],
  );

  const saved = useQuery({
    queryKey: homeKeys.savedIds(profileId),
    enabled: profileId !== null,
    queryFn: () => home.sources.library.savedTitleIds(profileId as string),
  });

  const isSaved = !!title && (saved.data?.includes(title.id) ?? false);

 
  const toggleSaved = useCallback(() => {
    if (!title || !profileId) return;
    const next = !isSaved;

    queryClient.setQueryData<TitleId[]>(homeKeys.savedIds(profileId), (current = []) =>
      next ? [...current, title.id] : current.filter((id) => id !== title.id),
    );
    eventBus.emit('title.saved', { titleId: title.id, saved: next });
    analytics.track(next ? 'add_to_list' : 'remove_from_list', { titleId: title.id });
  }, [title, profileId, isSaved, queryClient, eventBus, analytics]);

  return { title, genreNames, isSaved, toggleSaved, isLoading: candidates.isLoading };
}