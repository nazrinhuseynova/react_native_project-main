import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useTitlesByIds, type Title } from '@/features/catalog';
import { useLibrary } from '@/features/library';

import { buildTasteProfile, calculateMatchScore } from '../../domain/services/MatchScoreCalculator';

const TASTE_SAMPLE = 12;
const NO_GENRES: number[] = [];

/** null → hələ başlıq yoxdur. */
export function useMatchScore(title: Title | undefined): number | null {
  const { onboarding } = useServices();
  const { entries } = useLibrary();

  const likedIds = useMemo(
    () =>
      entries
        .filter((entry) => entry.favorite || entry.saved)
        .slice(0, TASTE_SAMPLE)
        .map((entry) => entry.titleId),
    [entries],
  );
  const { titles: liked } = useTitlesByIds(likedIds);

  const preferred = useQuery({
    queryKey: ['details', 'taste', 'onboardingGenres'],
    queryFn: () => onboarding.repository.getGenres(),
    staleTime: Infinity,
  });
  const preferredGenres = preferred.data ?? NO_GENRES;

  return useMemo(() => {
    if (!title) return null;
    const taste = buildTasteProfile(
      liked.map((item) => item.genreIds),
      preferredGenres,
    );
    return calculateMatchScore(title, taste);
  }, [title, liked, preferredGenres]);
}