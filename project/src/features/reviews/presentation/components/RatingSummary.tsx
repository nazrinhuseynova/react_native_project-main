import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { StarRating } from '@/shared/ui/StarRating';

import type { ReviewSummary } from '../../domain/entities/Review';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  root: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xl,
  },
  average: { alignItems: 'center' as const, gap: spacing.xs },
  bars: { flex: 1, gap: spacing.xs },
  barRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden' as const,
  },
  fill: { height: 6, backgroundColor: colors.star },
}));

type RatingSummaryProps = {
  summary: ReviewSummary;
  compact?: boolean;
};

export function RatingSummary({ summary, compact = false }: RatingSummaryProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <View style={styles.root}>
      <View style={styles.average}>
        <AppText variant="display">{summary.count > 0 ? summary.average.toFixed(1) : '–'}</AppText>
        <StarRating value={summary.average} readOnly size={16} />
        <AppText variant="caption" color="textSecondary">
          {t('reviews.summary.count', { count: summary.count })}
        </AppText>
      </View>
      {!compact ? (
        <View style={styles.bars}>
          {stars.map((star) => {
            const share = summary.count > 0 ? summary.distribution[star] / summary.count : 0;
            return (
              <View key={star} style={styles.barRow}>
                <AppText variant="caption" color="textSecondary" style={{ width: 10 }}>
                  {star}
                </AppText>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.round(share * 100)}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}