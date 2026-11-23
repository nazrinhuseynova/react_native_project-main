import { useAuth } from '@/features/auth';
import { useOnboardingStatus } from '@/features/onboarding';
import { useActiveProfile } from '@/features/profiles';

export type AppStage = 'onboarding' | 'auth' | 'profiles' | 'app';

export function resolveStage(
  hasSeenOnboarding: boolean,
  hasSession: boolean,
  hasProfile: boolean,
): AppStage {
  if (!hasSeenOnboarding) return 'onboarding';
  if (!hasSession) return 'auth';
  if (!hasProfile) return 'profiles';
  return 'app';
}

export function useAppGate(): { isReady: boolean; stage: AppStage } {
  const onboarding = useOnboardingStatus();
  const { isReady: authReady, session } = useAuth();
  const { isReady: profileReady, activeProfile } = useActiveProfile();

  return {
    isReady: onboarding.isReady && authReady && profileReady,
    stage: resolveStage(onboarding.hasSeenOnboarding, !!session, !!activeProfile),
  };
}