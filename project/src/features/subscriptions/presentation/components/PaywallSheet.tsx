import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';

type PaywallSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function PaywallSheet({ visible, onClose }: PaywallSheetProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('plans.title')}>
      <AppText variant="callout" color="textSecondary" style={{ marginBottom: spacing.lg }}>
        {t('plans.subtitle')}
      </AppText>

      <View style={{ gap: spacing.sm }}>
        <Button
          label={t('subscription.viewPlans')}
          onPress={() => {
            onClose();
            router.push('/billing/plans');
          }}
        />
        <Button label={t('common.cancel')} variant="ghost" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
