import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Divider } from '@/shared/ui/Divider';

import type { Plan } from '../../domain/entities/Plan';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  box: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.xs,
  },
  label: { flex: 1.4 },
  cell: { flex: 1, textAlign: 'center' as const },
}));

type PlanComparisonProps = {
  plans: readonly Plan[];
};

export function PlanComparison({ plans }: PlanComparisonProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const paid = plans.filter((p) => p.priceMinor > 0);

  if (paid.length === 0) return null;

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <View style={styles.label} />
        {paid.map((plan) => (
          <AppText key={plan.id} variant="captionStrong" style={styles.cell}>
            {plan.name}
          </AppText>
        ))}
      </View>
      <Divider />

      <View style={styles.row}>
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          {t('plans.quality')}
        </AppText>
        {paid.map((plan) => (
          <AppText key={plan.id} variant="captionStrong" style={styles.cell}>
            {plan.quality}
          </AppText>
        ))}
      </View>
      <Divider />

      <View style={styles.row}>
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          {t('plans.screens')}
        </AppText>
        {paid.map((plan) => (
          <AppText key={plan.id} variant="captionStrong" style={styles.cell}>
            {plan.maxScreens}
          </AppText>
        ))}
      </View>
      <Divider />

      <View style={styles.row}>
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          {t('plans.downloads')}
        </AppText>
        {paid.map((plan) => (
          <AppText key={plan.id} variant="captionStrong" style={styles.cell}>
            {plan.downloadsAllowed ? t('plans.yes') : t('plans.no')}
          </AppText>
        ))}
      </View>
    </View>
  );
}
