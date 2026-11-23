export { TitleDetailsScreen } from './presentation/screens/TitleDetailsScreen';

export { useMatchScore } from './application/hooks/useMatchScore';
export { useShareTitle } from './application/hooks/useShareTitle';
export { useTitleActions } from './application/hooks/useTitleActions';
export { detailSectionRegistry, createDetailSectionRegistry } from './application/detailSectionRegistry';
export type { DetailSection, DetailSectionProps } from './application/detailSectionRegistry';

export { calculateMatchScore, buildTasteProfile } from './domain/services/MatchScoreCalculator';
export { qualityBadgesFor } from './domain/services/QualityBadges';
export type { QualityBadge } from './domain/services/QualityBadges';