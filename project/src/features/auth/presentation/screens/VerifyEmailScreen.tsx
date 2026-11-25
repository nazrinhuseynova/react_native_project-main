import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';

import { useSignUp } from '../../application/hooks/useSignUp';
import { AuthButton, AuthForm, AuthLink, AuthMessage } from '../components/AuthForm';
import { ResendCodeButton } from '../components/ResendCodeButton';

export function VerifyEmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { supabase } = useServices();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';
  const { resendCode, resendErrorKey } = useSignUp();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void supabase.auth.getSession();
      }
    });
    return () => subscription.remove();
  }, [supabase]);

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
