import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useBiometricLogin } from '../../application/hooks/useBiometricLogin';
import { useSignIn } from '../../application/hooks/useSignIn';
import { loginSchema, type LoginValues } from '../../application/schemas/loginSchema';
import { AuthButton, AuthField, AuthForm, AuthLink, AuthMessage, authPalette } from '../components/AuthForm';
import { BiometricPrompt } from '../components/BiometricPrompt';
import { SocialButtons } from '../components/SocialButtons';

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; existing?: string }>();
  const { signIn, isPending, errorKey, lockout } = useSignIn();
  const biometric = useBiometricLogin();

  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: params.email ?? '', password: '' },
  });

  const onSubmit = handleSubmit((values) =>
    signIn({ kind: 'email_password', email: values.email, password: values.password }),
  );

  const biometricError = biometric.errorKey;

  return (
    <AuthForm
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      footer={
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ color: authPalette.muted }}>{t('auth.login.noAccount')}</Text>
          <AuthLink label={t('auth.login.register')} onPress={() => router.push('/register')} />
        </View>
      }
    >
      {params.existing === '1' ? (
        <AuthMessage tone="info" message={t('auth.login.existingAccount')} />
      ) : null}

      <AuthField
        control={control}
        name="email"
        label={t('auth.field.email')}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <AuthField
        control={control}
        name="password"
        label={t('auth.field.password')}
        secure
        autoComplete="password"
        textContentType="password"
      />

      {lockout.isLocked ? (
        <AuthMessage message={t('auth.login.locked', { time: formatSeconds(lockout.remainingSeconds) })} />
      ) : null}
      {errorKey ? <AuthMessage message={t(errorKey)} /> : null}
      {biometricError ? <AuthMessage message={t(biometricError)} /> : null}

      <AuthButton
        label={t('auth.login.submit')}
        onPress={onSubmit}
        loading={isPending}
        disabled={lockout.isLocked}
      />
      <AuthLink label={t('auth.login.forgot')} onPress={() => router.push('/forgot-password')} />

      {biometric.canUse ? (
        <BiometricPrompt
          onPress={() => biometric.signIn()}
          loading={biometric.isPending}
          disabled={isPending}
        />
      ) : null}

      <SocialButtons onGooglePress={() => signIn({ kind: 'google' })} disabled={isPending} />
    </AuthForm>
  );
}