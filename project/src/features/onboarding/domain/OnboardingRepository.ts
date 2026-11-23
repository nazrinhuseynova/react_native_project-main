export interface OnboardingRepository {
  hasSeen(): Promise<boolean>;
  markSeen(): Promise<void>;
  getGenres(): Promise<number[]>;
  saveGenres(ids: readonly number[]): Promise<void>;
  reset(): Promise<void>;
}