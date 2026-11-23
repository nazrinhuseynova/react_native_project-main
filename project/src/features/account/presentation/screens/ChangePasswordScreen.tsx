import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { PasswordField } from '@/shared/ui/PasswordField';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { useToast } from '@/shared/ui/ToastProvider';

import { useChangePassword } from '../../application/hooks/useChangePassword';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '../../application/schemas/accountSchemas';
import { ReauthSheet } from '../components/ReauthSheet';

export function ChangePasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { changePassword, isPending, errorKey, sheet } = useChangePassword();

  const { control, handleSubmit } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      const changed = await changePassword(password);
      if (changed) {
        toast.success(t('account.changePassword.success'));
        router.back();
      }
    } catch {
     
    }
  });

  return (
    <Screen
      scroll
      keyboardAvoiding
      padded={false}
      header={<ScreenHeader title={t('account.changePassword.title')} onBack={() => router.back()} />}
      contentContainerStyle={{ padding: 16 }}
    >
      <AppText variant="callout" color="textSecondary" style={{ marginBottom: 16 }}>
        {t('account.changePassword.subtitle')}
      </AppText>

      <View style={{ gap: 16 }}>
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <PasswordField
              label={t('auth.field.newPassword')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoComplete="new-password"
              textContentType="newPassword"
              helper={t('auth.validation.passwordWeak')}
              error={fieldState.error?.message ? t(fieldState.error.message) : null}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <PasswordField
              label={t('auth.field.confirmPassword')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoComplete="new-password"
              textContentType="newPassword"
              error={fieldState.error?.message ? t(fieldState.error.message) : null}
            />
          )}
        />

        {errorKey ? (
          <AppText variant="callout" color="danger" accessibilityLiveRegion="polite">
            {t(errorKey)}
          </AppText>
        ) : null}

        <Button label={t('account.changePassword.submit')} loading={isPending} onPress={() => void onSubmit()} />
      </View>

      <ReauthSheet {...sheet} />
    </Screen>
  );
}