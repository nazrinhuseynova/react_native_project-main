import type { RegistryItem } from '@/core/registry/Registry';
import type { Profile } from '@/features/profiles';

import type { ParentalSettings } from '../entities/ParentalSettings';


export type FilterableTitle = {
  id: string;
  certification?: string | null;
  adult?: boolean;
};

export type ContentContext = {
  profile: Pick<Profile, 'id' | 'isKids' | 'maturity'>;
  settings: ParentalSettings;
};

export interface ContentPolicy extends RegistryItem {
  allows(title: FilterableTitle, context: ContentContext): boolean;
}