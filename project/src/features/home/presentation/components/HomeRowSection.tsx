import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { TitleId } from '@/features/catalog';

import { useHomeRow } from '../../application/hooks/useHomeRow';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow } from '../../domain/HomeRow';
import { Carousel } from './Carousel';
import { RowSkeleton } from './HomeSkeleton';

type HomeRowSectionProps = {
  row: HomeRow;
  context: HomeContext;
  scale?: number;
  onPressTitle: (id: TitleId) => void;
};

export const HomeRowSection = memo(function HomeRowSection({
  row,
  context,
  scale = 1,
  onPressTitle,
}: HomeRowSectionProps) {
  const { t } = useTranslation();
  const { entries, titleParams, isLoading } = useHomeRow(row, context);

  if (isLoading) return <RowSkeleton variant={row.variant} scale={scale} />;
  if (entries.length === 0) return null;

  return (
    <Carousel
      title={t(row.titleKey, { ...(titleParams ?? {}) })}
      entries={entries}
      variant={row.variant}
      scale={scale}
      onPressTitle={onPressTitle}
    />
  );
});