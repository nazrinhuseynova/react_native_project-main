import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OTP_LENGTH, OTP_MAX_ATTEMPTS } from '@/core/config/constants';

import { usePasswordReset } from '../../application/hooks/usePasswordReset';
import { useSignUp } from '../../application/hooks/useSignUp';
import { AuthButton, AuthCodeInput, AuthForm, AuthLink, AuthMessage } from '../components/AuthForm';
import { ResendCodeButton } from '../components/ResendCodeButton';

export function VerifyOtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; purpose?: string }>();

  const email = params.email ?? '';
  const isRecovery = params.purpose === 'recovery';

  const signUp = useSignUp();
  const reset = usePasswordReset();

  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);

  const blocked = attempts >= OTP_MAX_ATTEMPTS;
  const isPending = isRecovery ? reset.isVerifying : signUp.isVerifying;
  const errorKey = isRecovery ? reset.verifyErrorKey : signUp.verifyErrorKey;

  const submit = async () => {
    if (code.length !== OTP_LENGTH || blocked) return;
    try {
      if (isRecovery) {
        await reset.verifyCode({ email, code });
        router.replace('/reset-password');
      } else {
        // Uğurlu olanda session yaranır və route guard özü yönləndirir.
        await signUp.verifyCode({ email, code });
      }
    } catch {
      setAttempts((value) => value + 1);
      setCode('');
    }
  };

  const resend = async () => {
    if (isRecovery) {
      await reset.requestCode(email);
    } else {
      await signUp.resendCode(email);
    }
    setAttempts(0);
    setCode('');
  };

  return (
    <AuthForm
      title={t('auth.otp.title')}
      subtitle={t('auth.otp.subtitle', { length: OTP_LENGTH, email })}
      footer={
        <>
          <ResendCodeButton onResend={resend} />
          <AuthLink label={t('common.back')} onPress={() => router.back()} />
        </>
      }
    >
      <AuthCodeInput
        value={code}
        onChange={setCode}
        length={OTP_LENGTH}
        editable={!blocked}
        label={t('auth.field.code')}
      />
      {blocked ? <AuthMessage message={t('auth.otp.blocked')} /> : null}
      {!blocked && errorKey ? <AuthMessage message={t(errorKey)} /> : null}
      <AuthButton
        label={t('auth.otp.submit')}
        onPress={submit}
        loading={isPending}
        disabled={code.length !== OTP_LENGTH || blocked}
      />
    </AuthForm>
  );
}