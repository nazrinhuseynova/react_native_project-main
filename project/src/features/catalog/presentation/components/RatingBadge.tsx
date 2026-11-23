import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

import type { Rating } from '../../domain/repositories/RatingSource';

type RatingBadgeProps = {
  rating: Rating;
};

export function RatingBadge({ rating }: RatingBadgeProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useTheme();
  const source = t(`catalog.rating.${rating.source}`);
  const value = rating.value.toFixed(1);

  return (
    <View
      accessible
      accessibilityLabel={`${source} ${value}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceElevated,
      }}
    >
      <Ionicons name="star" size={14} color={colors.star} />
      <AppText variant="captionStrong">{value}</AppText>
      <AppText variant="caption" color="textSecondary">
        {source}
      </AppText>
    </View>
  );
}