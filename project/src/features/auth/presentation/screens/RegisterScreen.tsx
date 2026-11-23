import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useSignUp } from '../../application/hooks/useSignUp';
import { registerSchema, type RegisterValues } from '../../application/schemas/registerSchema';
import { AuthButton, AuthField, AuthForm, AuthLink, AuthMessage, authPalette } from '../components/AuthForm';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { SocialButtons } from '../components/SocialButtons';
import { TermsCheckbox } from '../components/TermsCheckbox';
import { useSignIn } from '../../application/hooks/useSignIn';

export function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp, isPending, errorKey, getPasswordStrength } = useSignUp();
  const social = useSignIn();

  const { control, handleSubmit, watch } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptTerms: false },
  });

  const onSubmit = handleSubmit((values) =>
    signUp({ email: values.email, password: values.password }),
  );

  const busy = isPending || social.isPending;

  return (
    <AuthForm
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ color: authPalette.muted }}>{t('auth.register.haveAccount')}</Text>
          <AuthLink label={t('auth.register.login')} onPress={() => router.replace('/login')} />
        </View>
      }
    >
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

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field, fieldState }) => (
          <TermsCheckbox
            checked={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {errorKey ? <AuthMessage message={t(errorKey)} /> : null}
      {social.errorKey ? <AuthMessage message={t(social.errorKey)} /> : null}

      <AuthButton label={t('auth.register.submit')} onPress={onSubmit} loading={isPending} disabled={busy} />
      <SocialButtons onGooglePress={() => social.signIn({ kind: 'google' })} disabled={busy} />
    </AuthForm>
  );
}