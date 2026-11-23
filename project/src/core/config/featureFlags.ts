export const featureFlags = {
  cast: false,
  phoneLogin: false,
  stripe: false,
  tmdbProxy: false,
  analytics: true,
  uiSounds: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}