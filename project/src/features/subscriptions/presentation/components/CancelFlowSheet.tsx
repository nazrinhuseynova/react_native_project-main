import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';

type CancelFlowSheetProps = {
  visible: boolean;
  isCanceling: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function CancelFlowSheet({
  visible,
  isCanceling,
  onConfirm,
  onClose,
}: CancelFlowSheetProps) {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('subscription.cancelTitle')}>
      <AppText variant="callout" color="textSecondary" style={{ marginBottom: spacing.lg }}>
        {t('subscription.cancelMessage')}
      </AppText>

      <View style={{ gap: spacing.sm }}>
        <Button
          label={t('subscription.confirmCancel')}
          variant="danger"
          loading={isCanceling}
          onPress={onConfirm}
        />
        <Button
          label={t('subscription.keep')}
          variant="secondary"
          disabled={isCanceling}
          onPress={onClose}
        />
      </View>
    </BottomSheet>
  );
}
