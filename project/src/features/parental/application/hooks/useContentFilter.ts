import { useCallback, useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { useActiveProfile } from '@/features/profiles';

import { defaultParentalSettings } from '../../domain/entities/ParentalSettings';
import type { ContentContext, FilterableTitle } from '../../domain/policies/ContentPolicy';
import { useParentalSettings } from './useParentalSettings';

/** Home, Search və Details bunu istifadə edir. */
export function useContentFilter() {
  const { parental } = useServices();
  const { activeProfile } = useActiveProfile();
  const { settings } = useParentalSettings();

  const context = useMemo<ContentContext | null>(() => {
    if (!activeProfile) return null;
    return {
      profile: activeProfile,
      settings: settings ?? defaultParentalSettings(activeProfile.id),
    };
  }, [activeProfile, settings]);

  const filter = useCallback(
    <T extends FilterableTitle>(titles: readonly T[]): T[] =>
      context ? parental.filterTitles.execute(titles, context) : [...titles],
    [context, parental],
  );

  const isAllowed = useCallback(
    (title: FilterableTitle): boolean => (context ? parental.policy.allows(title, context) : true),
    [context, parental],
  );

  return { filter, isAllowed, isReady: context !== null };
}