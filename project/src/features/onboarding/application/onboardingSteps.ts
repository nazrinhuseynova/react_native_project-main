import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { Registry } from '@/core/registry/Registry';

import type { GenreOption, OnboardingStep } from '../domain/OnboardingStep';

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: 'watch-anywhere',
    order: 10,
    titleKey: 'onboarding.steps.watch.title',
    bodyKey: 'onboarding.steps.watch.body',
    icon: 'tv-outline',
  },
  {
    id: 'download',
    order: 20,
    titleKey: 'onboarding.steps.download.title',
    bodyKey: 'onboarding.steps.download.body',
    icon: 'download-outline',
  },
  {
    id: 'personalized',
    order: 30,
    titleKey: 'onboarding.steps.personalized.title',
    bodyKey: 'onboarding.steps.personalized.body',
    icon: 'sparkles-outline',
  },
];


const GENRE_IDS = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53];

export const genreOptions: readonly GenreOption[] = GENRE_IDS.map((id) => ({
  id,
  labelKey: `onboarding.genres.options.${id}`,
}));

export function createOnboardingStepRegistry(): Registry<OnboardingStep> {
  return new Registry<OnboardingStep>().registerAll(onboardingSteps);
}

export function useOnboardingSteps(): OnboardingStep[] {
  const { onboarding } = useServices();
  return useMemo(() => onboarding.steps.all(), [onboarding]);
}