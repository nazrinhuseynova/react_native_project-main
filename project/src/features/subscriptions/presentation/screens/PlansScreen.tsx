import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

import { formatMoney } from '@/core/utils/formatMoney';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useChangePlan } from '../../application/hooks/useChangePlan';
import { usePlans } from '../../application/hooks/usePlans';
import { useSubscription } from '../../application/hooks/useSubscription';
import type { Plan } from '../../domain/entities/Plan';
import { NO_PAYMENT_METHOD } from '../../domain/usecases/ChangePlan';
import { PlanCard } from '../components/PlanCard';
import { PlanComparison } from '../components/PlanComparison';

export function PlansScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const { plans, isLoading, isError, refetch } = usePlans();
  const { currentPlan } = useSubscription();
  const { changePlan, isChanging } = useChangePlan();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const header = <ScreenHeader title={t('plans.title')} onBack={() => router.back()} />;

  const runChange = async (plan: Plan) => {
    setSelectedPlanId(plan.id);
    try {
      const result = await changePlan(plan.id);
      if (!result.ok && result.code === NO_PAYMENT_METHOD) {
        router.push('/billing/payment-methods');
      }
    } finally {
      setSelectedPlanId(null);
    }
  };

  const handleSelect = (plan: Plan) => {
    if (isChanging) return;


    if (plan.priceMinor > 0) {
      Alert.alert(
        t('subscription.confirmChangeTitle'),
        t('subscription.confirmChangeMessage', {
          plan: plan.name,
          price: formatMoney(plan.priceMinor, plan.currency, i18n.language),
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.confirm'), onPress: () => void runChange(plan) },
        ],
      );
      return;
    }

    void runChange(plan);
  };

  if (isError && plans.length === 0) {
    return (
      <Screen header={header}>
        <ErrorState
          title={t('plans.error')}
          retryLabel={t('subscription.retry')}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      padded={false}
      header={header}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }}
    >
      <AppText variant="callout" color="textSecondary">
        {t('plans.subtitle')}
      </AppText>

      {isLoading ? (
        <View style={{ gap: spacing.md }}>
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} height={160} radius={12} />
          ))}
        </View>
      ) : (
        <>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={currentPlan?.id === plan.id}
              isLoading={isChanging && selectedPlanId === plan.id}
              disabled={isChanging}
              onSelect={handleSelect}
            />
          ))}

          <PlanComparison plans={plans} />
        </>
      )}
    </Screen>
  );
}