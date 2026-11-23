import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';
import { PasswordField } from '@/shared/ui/PasswordField';

import type { StepUpSheetState } from '../../application/hooks/useStepUp';

export function ReauthSheet({ visible, isVerifying, errorKey, onSubmit, onCancel }: StepUpSheetState) {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!visible) setPassword('');
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onCancel} title={t('account.reauth.title')}>
      <AppText variant="callout" color="textSecondary" style={{ marginBottom: spacing.lg }}>
        {t('account.reauth.message')}
      </AppText>

      <PasswordField
        label={t('account.reauth.password')}
        value={password}
        onChangeText={setPassword}
        error={errorKey ? t(errorKey) : null}
        returnKeyType="done"
        onSubmitEditing={() => password && onSubmit(password)}
      />

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <Button
          label={t('common.confirm')}
          loading={isVerifying}
          disabled={password.length === 0}
          onPress={() => onSubmit(password)}
        />
        <Button label={t('common.cancel')} variant="ghost" disabled={isVerifying} onPress={onCancel} />
      </View>
    </BottomSheet>
  );
}