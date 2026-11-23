export { GenrePickerScreen } from './presentation/screens/GenrePickerScreen';
export { IntroScreen } from './presentation/screens/IntroScreen';
export { SplashScreen } from './presentation/screens/SplashScreen';

export { useGenrePicks, MIN_GENRE_PICKS } from './application/hooks/useGenrePicks';
export { useOnboardingStatus } from './application/hooks/useOnboardingStatus';

export type { GenreOption, OnboardingStep } from './domain/OnboardingStep';
export type { OnboardingRepository } from './domain/OnboardingRepository';

export { createOnboardingStepRegistry } from './application/onboardingSteps';
export { AsyncOnboardingRepository } from './data/AsyncOnboardingRepository';