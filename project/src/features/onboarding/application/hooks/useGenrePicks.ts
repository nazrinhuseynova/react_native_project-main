import { useCallback, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';

import { genreOptions } from '../onboardingSteps';
import { useOnboardingStatus } from './useOnboardingStatus';

export const MIN_GENRE_PICKS = 3;

export function useGenrePicks() {
  const { onboarding } = useServices();
  const { complete } = useOnboardingStatus();
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set());
  const [isSaving, setIsSaving] = useState(false);

  const toggle = useCallback((id: number) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const finish = useCallback(
    async (options: { skip?: boolean } = {}) => {
      setIsSaving(true);
      try {
        await onboarding.repository.saveGenres(options.skip ? [] : [...selected]);
        await complete();
      } finally {
        setIsSaving(false);
      }
    },
    [onboarding, complete, selected],
  );

  return {
    options: genreOptions,
    selected,
    toggle,
    minPicks: MIN_GENRE_PICKS,
    canContinue: selected.size >= MIN_GENRE_PICKS,
    isSaving,
    finish,
  };
}