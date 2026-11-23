
export { BlockedTitlesScreen } from './presentation/screens/BlockedTitlesScreen';
export { ParentalControlsScreen } from './presentation/screens/ParentalControlsScreen';


export { useContentFilter } from './application/hooks/useContentFilter';
export { useParentalSettings } from './application/hooks/useParentalSettings';

export { defaultParentalSettings } from './domain/entities/ParentalSettings';
export type {
  BlockedTitle,
  BlockedTitleInput,
  ParentalSettings,
} from './domain/entities/ParentalSettings';
export type {
  ContentContext,
  ContentPolicy,
  FilterableTitle,
} from './domain/policies/ContentPolicy';
export type { ParentalRepository } from './domain/repositories/ParentalRepository';


export { createContentPolicyRegistry } from './application/contentPolicyRegistry';
export { CompositePolicy } from './domain/policies/CompositePolicy';
export { BlockTitle } from './domain/usecases/BlockTitle';
export { FilterTitles } from './domain/usecases/FilterTitles';
export { SetMaxMaturity } from './domain/usecases/SetMaxMaturity';
export { UnblockTitle } from './domain/usecases/UnblockTitle';
export { SupabaseParentalRepository } from './data/SupabaseParentalRepository';