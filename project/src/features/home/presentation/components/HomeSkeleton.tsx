import { useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { Skeleton } from '@/shared/ui/Skeleton';

import type { HomeRowVariant } from '../../domain/HomeRow';

const CARD_SIZE: Record<HomeRowVariant, { width: number; height: number }> = {
  poster: { width: 118, height: 177 },
  backdrop: { width: 240, height: 135 },
  top10: { width: 150, height: 153 },
  continue: { width: 220, height: 124 },
};

export function HeroSkeleton() {
  const { width } = useWindowDimensions();
  return <Skeleton width={width} height={Math.min(Math.round(width * 1.25), 540)} radius={0} />;
}

export function RowSkeleton({ variant = 'poster', scale = 1 }: { variant?: HomeRowVariant; scale?: number }) {
  const { spacing } = useTheme();
  const size = CARD_SIZE[variant];

  return (
    <View style={{ marginTop: spacing.lg, paddingHorizontal: spacing.lg }}>
      <Skeleton width={140} height={18} style={{ marginBottom: spacing.md }} />
      <View style={{ flexDirection: 'row', gap: spacing.md, overflow: 'hidden' }}>
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} width={size.width * scale} height={size.height * scale} radius={8} />
        ))}
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View>
      <HeroSkeleton />
      <RowSkeleton />
      <RowSkeleton variant="backdrop" />
    </View>
  );
}
