import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

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
import { PlanCard } from '../components/PlanCard';
import { PlanComparison } from '../components/PlanComparison';

export function PlansScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();
  const { plans, isLoading, isError, refetch } = usePlans();
  const { currentPlan } = useSubscription();
  const { changePlan, isChanging } = useChangePlan();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const header = <ScreenHeader title={t('plans.title')} onBack={() => router.back()} />;

  const handleSelect = async (plan: Plan) => {
    setSelectedPlanId(plan.id);
    try {
      await changePlan(plan.id);
    } finally {
      setSelectedPlanId(null);
    }
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
              onSelect={(next) => void handleSelect(next)}
            />
          ))}

          <PlanComparison plans={plans} />
        </>
      )}
    </Screen>
  );
}
