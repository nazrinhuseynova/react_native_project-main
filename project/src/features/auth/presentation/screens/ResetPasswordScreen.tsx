import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { usePasswordReset } from '../../application/hooks/usePasswordReset';
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '../../application/schemas/resetPasswordSchema';
import { AuthButton, AuthField, AuthForm, AuthLink, AuthMessage } from '../components/AuthForm';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

export function ResetPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resetPassword, isResetting, resetErrorKey, getPasswordStrength, abandon } =
    usePasswordReset();

  const { control, handleSubmit, watch } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Uğurlu olanda recovery bitir, session görünür olur və route guard yönləndirir.
  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      await resetPassword(password);
    } catch {
      // Xəta resetErrorKey ilə göstərilir.
    }
  });

  const onCancel = async () => {
    try {
      await abandon();
    } finally {
      router.replace('/login');
    }
  };

  return (
    <AuthForm
      title={t('auth.reset.title')}
      subtitle={t('auth.reset.subtitle')}
      footer={<AuthLink label={t('auth.reset.cancel')} onPress={onCancel} />}
    >
      <AuthField
        control={control}
        name="password"
        label={t('auth.field.newPassword')}
        secure
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <PasswordStrengthMeter level={getPasswordStrength(watch('password'))} />
      <AuthField
        control={control}
        name="confirmPassword"
        label={t('auth.field.confirmPassword')}
        secure
        autoComplete="new-password"
        textContentType="newPassword"
      />
      {resetErrorKey ? <AuthMessage message={t(resetErrorKey)} /> : null}
      <AuthButton label={t('auth.reset.submit')} onPress={onSubmit} loading={isResetting} />
    </AuthForm>
  );
}