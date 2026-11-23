import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { usePasswordReset } from '../../application/hooks/usePasswordReset';
import { loginSchema } from '../../application/schemas/loginSchema';
import { AuthButton, AuthField, AuthForm, AuthLink, AuthMessage } from '../components/AuthForm';

const forgotSchema = loginSchema.pick({ email: true });
type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { requestCode, isRequesting, requestErrorKey } = usePasswordReset();

  const { control, handleSubmit } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await requestCode(email);
      router.push({ pathname: '/verify-otp', params: { email, purpose: 'recovery' } });
    } catch {
   
    }
  });

  return (
    <AuthForm
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      footer={<AuthLink label={t('auth.forgot.back')} onPress={() => router.back()} />}
    >
      <AuthField
        control={control}
        name="email"
        label={t('auth.field.email')}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      {requestErrorKey ? <AuthMessage message={t(requestErrorKey)} /> : null}
      <AuthButton label={t('auth.forgot.submit')} onPress={onSubmit} loading={isRequesting} />
    </AuthForm>
  );
}