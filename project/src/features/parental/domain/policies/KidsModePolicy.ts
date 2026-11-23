import { KIDS_MATURITY, isWithinMaturity, parseMaturity } from '@/features/profiles';

import type { ContentContext, ContentPolicy, FilterableTitle } from './ContentPolicy';


export class KidsModePolicy implements ContentPolicy {
  readonly id = 'kids-mode';
  readonly order = 10;

  allows(title: FilterableTitle, { profile }: ContentContext): boolean {
    if (!profile.isKids) return true;
    if (title.adult) return false;

    const rating = parseMaturity(title.certification);
    if (!rating) return false;
    return isWithinMaturity(rating, KIDS_MATURITY);
  }
}