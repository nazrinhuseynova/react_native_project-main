import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { formatDate } from '@/core/utils/formatDate';
import { formatMoney } from '@/core/utils/formatMoney';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useCancelSubscription } from '../../application/hooks/useCancelSubscription';
import { useSubscription } from '../../application/hooks/useSubscription';
import { CancelFlowSheet } from '../components/CancelFlowSheet';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
}));

export function SubscriptionScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { spacing } = useTheme();
  const cancelSheet = useDisclosure();

  const { subscription, currentPlan, isLoading, isError, refetch } = useSubscription();
  const { cancelSubscription, isCanceling, resumeSubscription, isResuming } =
    useCancelSubscription();

  if (isError) {
    return (
      <Screen>
        <ErrorState
          title={t('subscription.error')}
          retryLabel={t('subscription.retry')}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  if (isLoading || !currentPlan) {
    return (
      <Screen contentContainerStyle={{ gap: spacing.md }}>
        <Skeleton height={150} radius={12} />
        <Skeleton height={48} radius={10} />
      </Screen>
    );
  }

  const isPaid = subscription !== null && currentPlan.priceMinor > 0;
  const isCanceled = subscription?.cancelAtPeriodEnd === true;

  const badgeTone = !isPaid ? 'neutral' : isCanceled ? 'warning' : 'success';
  const badgeLabel = !isPaid
    ? t('subscription.status.none')
    : isCanceled
      ? t('subscription.status.canceled')
      : t('subscription.status.active');

  const priceLabel =
    currentPlan.priceMinor === 0
      ? t('subscription.free')
      : t('subscription.price', {
          price: formatMoney(currentPlan.priceMinor, currentPlan.currency, i18n.language),
        });

  const periodDate = subscription
    ? formatDate(subscription.currentPeriodEnd, i18n.language)
    : null;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxxl }}>
      <View style={styles.card}>
        <AppText variant="captionStrong" color="textSecondary">
          {t('subscription.currentPlan')}
        </AppText>

        <View style={styles.row}>
          <AppText variant="title2">{currentPlan.name}</AppText>
          <Badge label={badgeLabel} tone={badgeTone} />
        </View>

        <AppText variant="headline" color="primary">
          {priceLabel}
        </AppText>

        <AppText variant="callout" color="textSecondary">
          {currentPlan.quality} · {currentPlan.maxScreens} {t('plans.screens')}
        </AppText>

        {isPaid && periodDate ? (
          <AppText variant="caption" color="textMuted">
            {isCanceled
              ? t('subscription.endsOn', { date: periodDate })
              : t('subscription.renewsOn', { date: periodDate })}
          </AppText>
        ) : !isPaid ? (
          <AppText variant="caption" color="textMuted">
            {t('subscription.noPlan')}
          </AppText>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          label={isPaid ? t('subscription.changePlan') : t('subscription.viewPlans')}
          onPress={() => router.push('/billing/plans')}
        />

        {isPaid && isCanceled ? (
          <Button
            label={t('subscription.resume')}
            variant="secondary"
            loading={isResuming}
            onPress={() => void resumeSubscription()}
          />
        ) : null}

        {isPaid && !isCanceled ? (
          <Button
            label={t('subscription.cancel')}
            variant="ghost"
            onPress={cancelSheet.open}
          />
        ) : null}
      </View>

      <View>
        <Divider />
        <ListRow
          icon="card-outline"
          title="Payment Methods"
          onPress={() => router.push('/billing/payment-methods')}
        />
        <Divider />
        <ListRow
          icon="receipt-outline"
          title="Billing History"
          onPress={() => router.push('/billing/history')}
        />
        <Divider />
      </View>

      <CancelFlowSheet
        visible={cancelSheet.isOpen}
        isCanceling={isCanceling}
        onClose={cancelSheet.close}
        onConfirm={() => {
          void cancelSubscription().then(() => cancelSheet.close());
        }}
      />
    </Screen>
  );
}
