import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { formatMoney } from '@/core/utils/formatMoney';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

import type { Plan } from '../../domain/entities/Plan';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: spacing.sm,
  },
  meta: {
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
}));

type PlanCardProps = {
  plan: Plan;
  isCurrent: boolean;
  isLoading?: boolean;
  onSelect: (plan: Plan) => void;
};

export function PlanCard({ plan, isCurrent, isLoading = false, onSelect }: PlanCardProps) {
  const { t, i18n } = useTranslation();
  const styles = useStyles();

  const priceText =
    plan.priceMinor === 0
      ? t('subscription.free')
      : `${formatMoney(plan.priceMinor, plan.currency, i18n.language)} ${t('subscription.perMonth')}`;

  return (
    <View style={[styles.card, isCurrent ? styles.activeCard : null]}>
      <View style={styles.header}>
        <AppText variant="title3">{plan.name}</AppText>
        {isCurrent ? (
          <Badge label={t('plans.current')} tone="success" />
        ) : plan.isPopular ? (
          <Badge label={t('plans.popular')} tone="info" />
        ) : null}
      </View>

      <AppText variant="headline" color="primary">
        {priceText}
      </AppText>

      <View style={styles.meta}>
        <AppText variant="callout" color="textSecondary">
          {t('plans.quality')}: {plan.quality}
        </AppText>
        <AppText variant="callout" color="textSecondary">
          {t('plans.screens')}: {plan.maxScreens}
        </AppText>
        <AppText variant="callout" color="textSecondary">
          {t('plans.downloads')}: {plan.downloadsAllowed ? t('plans.yes') : t('plans.no')}
        </AppText>
      </View>

      <Button
        label={isCurrent ? t('plans.selected') : t('plans.select')}
        variant={isCurrent ? 'secondary' : 'primary'}
        disabled={isCurrent || isLoading}
        loading={isLoading}
        onPress={() => onSelect(plan)}
      />
    </View>
  );
}
