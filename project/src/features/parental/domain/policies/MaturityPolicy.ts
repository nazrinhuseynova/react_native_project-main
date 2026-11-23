import {
  UNRATED_ASSUMED,
  isWithinMaturity,
  minMaturity,
  parseMaturity,
} from '@/features/profiles';

import type { ContentContext, ContentPolicy, FilterableTitle } from './ContentPolicy';


export class MaturityPolicy implements ContentPolicy {
  readonly id = 'maturity';
  readonly order = 20;

  allows(title: FilterableTitle, { profile, settings }: ContentContext): boolean {
    const max = minMaturity(profile.maturity, settings.maxMaturity);
    const rating = title.adult ? 'NC-17' : (parseMaturity(title.certification) ?? UNRATED_ASSUMED);
    return isWithinMaturity(rating, max);
  }
}