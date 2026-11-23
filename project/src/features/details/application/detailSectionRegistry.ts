import type { ComponentType } from 'react';

import { Registry } from '@/core/registry/Registry';
import { isSeries, type TitleDetails } from '@/features/catalog';

import { CastSection } from '../presentation/components/sections/CastSection';
import { EpisodesSection } from '../presentation/components/sections/EpisodesSection';
import { OverviewSection } from '../presentation/components/sections/OverviewSection';
import { ReviewsPreviewSection } from '../presentation/components/sections/ReviewsPreviewSection';
import { SimilarSection } from '../presentation/components/sections/SimilarSection';
import { TrailersSection } from '../presentation/components/sections/TrailersSection';

export type DetailSectionProps = {
  details: TitleDetails;
};

export type DetailSection = {
  readonly id: string;
  readonly order: number;
  readonly Component: ComponentType<DetailSectionProps>;
  readonly isVisible?: (details: TitleDetails) => boolean;
};


export function createDetailSectionRegistry(): Registry<DetailSection> {
  return new Registry<DetailSection>().registerAll([
    { id: 'overview', order: 10, Component: OverviewSection },
    { id: 'episodes', order: 20, Component: EpisodesSection, isVisible: (d) => isSeries(d.title) },
    { id: 'cast', order: 30, Component: CastSection, isVisible: (d) => d.cast.length > 0 },
    { id: 'trailers', order: 40, Component: TrailersSection },
    { id: 'reviews', order: 50, Component: ReviewsPreviewSection },
    { id: 'similar', order: 60, Component: SimilarSection },
  ]);
}

export const detailSectionRegistry = createDetailSectionRegistry();