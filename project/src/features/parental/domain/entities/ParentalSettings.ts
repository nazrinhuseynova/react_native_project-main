import type { MaturityRating } from '@/features/profiles';

export type BlockedTitle = {
  titleId: string;
  title: string;
  posterUrl: string | null;
  blockedAt: string;
};

export type BlockedTitleInput = Pick<BlockedTitle, 'titleId' | 'title' | 'posterUrl'>;

export type ParentalSettings = {
  profileId: string;
  maxMaturity: MaturityRating;
  blockedTitles: BlockedTitle[];
};

export function defaultParentalSettings(profileId: string): ParentalSettings {
  return { profileId, maxMaturity: 'NC-17', blockedTitles: [] };
}