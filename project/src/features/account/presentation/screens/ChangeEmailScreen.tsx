import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { TextField } from '@/shared/ui/TextField';

import { useChangeEmail } from '../../application/hooks/useChangeEmail';
import { changeEmailSchema, type ChangeEmailValues } from '../../application/schemas/accountSchemas';
import { ReauthSheet } from '../components/ReauthSheet';

export function ChangeEmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentEmail, changeEmail, isPending, errorKey, sheet } = useChangeEmail();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      const target = await changeEmail(email);
      if (target) setSentTo(target);
    } catch {
     
    }
  });

  return (
    <Screen
      scroll
      keyboardAvoiding
      padded={false}
      header={<ScreenHeader title={t('account.changeEmail.title')} onBack={() => router.back()} />}
      contentContainerStyle={{ padding: 16 }}
    >
      {sentTo ? (
        <View style={{ gap: 16 }}>
          <AppText variant="headline">{t('account.changeEmail.sentTitle')}</AppText>
          <AppText variant="body" color="textSecondary">
            {t('account.changeEmail.sentMessage', { email: sentTo })}
          </AppText>
          <Button label={t('common.done')} onPress={() => router.back()} />
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <AppText variant="callout" color="textSecondary">
            {t('account.changeEmail.subtitle')}
          </AppText>

          <TextField label={t('account.changeEmail.current')} value={currentEmail} editable={false} />

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                label={t('account.changeEmail.new')}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                error={
                  fieldState.error?.message
                    ? t(fieldState.error.message)
                    : errorKey
                      ? t(errorKey)
                      : null
                }
              />
            )}
          />

          <Button label={t('account.changeEmail.submit')} loading={isPending} onPress={() => void onSubmit()} />
        </View>
      )}

      <ReauthSheet {...sheet} />
    </Screen>
  );
}