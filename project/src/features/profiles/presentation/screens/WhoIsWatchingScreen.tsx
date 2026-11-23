import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/ToastProvider';
import { Ionicons } from '@expo/vector-icons';

import { useActiveProfile } from '../../application/hooks/useActiveProfile';
import { useProfiles } from '../../application/hooks/useProfiles';
import { hasPin, type Profile } from '../../domain/entities/Profile';
import { ProfileTile } from '../components/ProfileTile';

const useStyles = makeStyles(({ spacing, colors }) => ({
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    columnGap: spacing.lg,
    marginTop: spacing.xl,
  },
  addTile: {
    alignItems: 'center' as const,
    width: 112,
    marginBottom: spacing.lg,
  },
  addCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    borderColor: colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: spacing.sm,
  },
  footer: { marginTop: spacing.xl, gap: spacing.sm },
}));

export function WhoIsWatchingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const { switchProfile } = useActiveProfile();
  const { profiles, isLoading, isError, refetch, canCreate } = useProfiles();

  const onSelect = async (profile: Profile) => {
    if (hasPin(profile)) {
      router.push({ pathname: '/pin', params: { profileId: profile.id } });
      return;
    }
    try {
      // Aktiv profil təyin olunanda route guard özü Home-a yönləndirir.
      await switchProfile(profile.id);
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    }
  };

  const onAdd = () =>
    router.push({ pathname: '/edit/[profileId]', params: { profileId: 'new' } });

  if (isError && profiles.length === 0) {
    return (
      <Screen>
        <ErrorState message={t('errors.unknown')} onRetry={() => void refetch()} retryLabel={t('common.retry')} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="title1" align="center" style={{ marginTop: 32 }}>
        {t('profiles.whoIsWatching')}
      </AppText>

      {isLoading ? (
        <View style={styles.grid}>
          {[0, 1, 2].map((key) => (
            <View key={key} style={styles.addTile}>
              <Skeleton circle height={96} />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.grid}>
          {profiles.map((profile) => (
            <ProfileTile key={profile.id} profile={profile} onPress={onSelect} />
          ))}

          {canCreate ? (
            <ScalePressable {...buttonA11y(t('profiles.addProfile'))} onPress={onAdd} style={styles.addTile}>
              <View style={styles.addCircle}>
                <Ionicons name="add" size={40} color={colors.textSecondary} />
              </View>
              <AppText variant="bodyStrong" color="textSecondary">
                {t('profiles.addProfile')}
              </AppText>
            </ScalePressable>
          ) : null}
        </View>
      )}

      <View style={styles.footer}>
        {profiles.length > 0 ? (
          <Button
            label={t('profiles.manage')}
            variant="secondary"
            leftIcon="settings-outline"
            onPress={() => router.push('/manage')}
          />
        ) : null}
        <Button label={t('profiles.signOut')} variant="ghost" onPress={() => void signOut()} />
      </View>
    </Screen>
  );
}