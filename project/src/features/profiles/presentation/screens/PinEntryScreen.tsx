import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { PinPad } from '@/shared/ui/PinPad';
import { Screen } from '@/shared/ui/Screen';

import { usePinGate } from '../../application/hooks/usePinGate';
import { useProfiles } from '../../application/hooks/useProfiles';
import { ProfileAvatar } from '../components/ProfileAvatar';

const useStyles = makeStyles(({ spacing }) => ({
  center: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatar: { marginBottom: spacing.lg },
  title: { marginBottom: spacing.xs },
  pad: { marginTop: spacing.xl },
}));

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function PinEntryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  const { profiles } = useProfiles();
  const profile = profiles.find((item) => item.id === profileId);
  const gate = usePinGate(profileId);
  const [pin, setPin] = useState('');

  const { verify } = gate;
  const onComplete = useCallback(
    async (value: string) => {
      const ok = await verify(value);
      if (!ok) setPin('');
    },
    [verify],
  );

  const error = gate.isLocked
    ? t('profiles.pin.locked', { time: formatTime(gate.lockRemainingSeconds) })
    : gate.hasError
      ? t('profiles.pin.wrong', { attempts: gate.attemptsLeft ?? 0 })
      : null;

  return (
    <Screen>
      <View style={styles.center}>
        {profile ? (
          <View style={styles.avatar}>
            <ProfileAvatar profile={profile} size={72} />
          </View>
        ) : null}
        <AppText variant="title2" style={styles.title}>
          {t('profiles.pin.title')}
        </AppText>
        <AppText variant="callout" color="textSecondary">
          {t('profiles.pin.subtitle', { name: profile?.name ?? '' })}
        </AppText>

        <View style={styles.pad}>
          <PinPad
            value={pin}
            onChange={setPin}
            onComplete={onComplete}
            error={error}
            disabled={gate.isLocked || gate.isVerifying}
          />
        </View>
      </View>
      <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}