import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGenres } from '@/features/catalog';

import { ALL_CATEGORY, isSameCategory, type CategoryFilter } from '../../domain/CategoryFilter';
import { usePreferredGenreIds } from './usePreferredGenres';

const MAX_GENRE_PILLS = 12;

export type CategoryOption = {
  key: string;
  label: string;
  filter: CategoryFilter;
};

export function useCategoryFilter() {
  const { t } = useTranslation();
  const { genres } = useGenres();
  const preferredGenreIds = usePreferredGenreIds();
  const [category, setCategory] = useState<CategoryFilter>(ALL_CATEGORY);

  const options = useMemo<CategoryOption[]>(() => {
    const base: CategoryOption[] = [
      { key: 'all', label: t('home.categories.all'), filter: ALL_CATEGORY },
      { key: 'tv', label: t('home.categories.tvShows'), filter: { kind: 'tv' } },
      { key: 'movie', label: t('home.categories.movies'), filter: { kind: 'movie' } },
    ];

    const preferredSet = new Set(preferredGenreIds);
    const preferred = preferredGenreIds.flatMap((id) => genres.find((genre) => genre.id === id) ?? []);
    const others = genres.filter((genre) => !preferredSet.has(genre.id));

    const genreOptions = [...preferred, ...others].slice(0, MAX_GENRE_PILLS).map<CategoryOption>(
      (genre) => ({
        key: `genre:${genre.id}`,
        label: genre.name,
        filter: { kind: 'genre', genreId: genre.id },
      }),
    );

    return [...base, ...genreOptions];
  }, [t, genres, preferredGenreIds]);

  const isSelected = useCallback(
    (option: CategoryOption) => isSameCategory(option.filter, category),
    [category],
  );

  return { category, options, select: setCategory, isSelected };
}