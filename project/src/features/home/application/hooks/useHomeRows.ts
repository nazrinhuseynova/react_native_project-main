import { useQueryClient } from '@tanstack/react-query';
import { getLocales } from 'expo-localization';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useGenres } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';
import { useRefresh } from '@/shared/hooks/useRefresh';

import { categoryKey, type CategoryFilter } from '../../domain/CategoryFilter';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow } from '../../domain/HomeRow';
import { homeKeys } from '../homeKeys';
import { GenreRowFactory } from '../rows/GenreRowFactory';
import { usePreferredGenreIds } from './usePreferredGenres';

const INITIAL_ROWS = 4;
const ROWS_PER_PAGE = 3;

export function useHomeRows(category: CategoryFilter) {
  const { catalog, home } = useServices();
  const { activeProfile } = useActiveProfile();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { genres, names } = useGenres();
  const preferredGenreIds = usePreferredGenreIds();
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS);

  const categoryId = categoryKey(category);

  useEffect(() => {
    setVisibleCount(INITIAL_ROWS);
  }, [categoryId]);

  const profileId = activeProfile?.id ?? null;
  const isKids = activeProfile?.isKids ?? false;

  const context = useMemo<HomeContext | null>(() => {
    if (!profileId) return null;
    return {
      profile: { id: profileId, isKids },
      language: i18n.language,
      country: getLocales()[0]?.regionCode ?? null,
      category,
      preferredGenreIds,
      genreNames: names,
      discover: catalog.discover,
      titles: catalog.titles,
      sources: home.sources,
    };
  }, [profileId, isKids, i18n.language, category, preferredGenreIds, names, catalog, home]);

  const rows = useMemo<HomeRow[]>(() => {
    if (!context) return [];

    if (category.kind === 'genre') return GenreRowFactory.forCategory(category.genreId);

    const audience = isKids ? 'kids' : 'standard';
    const base = home.rows
      .all()
      .filter(
        (row) =>
          (row.audience === 'all' || row.audience === audience) &&
          row.categories.includes(category.kind),
      );

    
    const preferred = isKids || genres.length === 0 ? [] : GenreRowFactory.forPreferences(preferredGenreIds);

    return [...base, ...preferred].sort((a, b) => a.order - b.order);
  }, [context, category, isKids, home, genres.length, preferredGenreIds]);

  const loadMore = useCallback(() => {
    setVisibleCount((count) => count + ROWS_PER_PAGE);
  }, []);

  const { refreshing, onRefresh } = useRefresh(() =>
    queryClient.invalidateQueries({ queryKey: homeKeys.all }),
  );

  return {
    context,
    visibleRows: rows.slice(0, visibleCount),
    hasMore: visibleCount < rows.length,
    loadMore,
    refreshing,
    onRefresh,
  };
}