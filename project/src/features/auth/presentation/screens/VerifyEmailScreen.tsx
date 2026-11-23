import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useSignUp } from '../../application/hooks/useSignUp';
import { AuthButton, AuthForm, AuthLink, AuthMessage } from '../components/AuthForm';
import { ResendCodeButton } from '../components/ResendCodeButton';

export function VerifyEmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';
  const { resendCode, resendErrorKey } = useSignUp();

  return (
    <AuthForm
      title={t('auth.verifyEmail.title')}
      subtitle={t('auth.verifyEmail.subtitle', { email })}
      footer={
        <>
          <ResendCodeButton onResend={() => resendCode(email)} />
          <AuthLink label={t('auth.forgot.back')} onPress={() => router.replace('/login')} />
        </>
      }
    >
      {resendErrorKey ? <AuthMessage message={t(resendErrorKey)} /> : null}
      <AuthButton
        label={t('auth.verifyEmail.enterCode')}
        onPress={() =>
          router.push({ pathname: '/verify-otp', params: { email, purpose: 'signup' } })
        }
      />
    </AuthForm>
  );
}