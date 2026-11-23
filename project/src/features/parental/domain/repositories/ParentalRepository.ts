import type { MaturityRating } from '@/features/profiles';

import type { BlockedTitleInput, ParentalSettings } from '../entities/ParentalSettings';

export interface ParentalRepository {
  get(profileId: string): Promise<ParentalSettings>;
  setMaxMaturity(profileId: string, rating: MaturityRating): Promise<void>;
  block(profileId: string, title: BlockedTitleInput): Promise<void>;
  unblock(profileId: string, titleId: string): Promise<void>;
}