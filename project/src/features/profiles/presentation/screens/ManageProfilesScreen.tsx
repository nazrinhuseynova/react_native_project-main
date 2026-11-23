import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';

import { useProfiles } from '../../application/hooks/useProfiles';
import type { Profile } from '../../domain/entities/Profile';
import { ProfileTile } from '../components/ProfileTile';

const useStyles = makeStyles(({ spacing, colors }) => ({
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    columnGap: spacing.lg,
    marginTop: spacing.lg,
  },
  addTile: { alignItems: 'center' as const, width: 112, marginBottom: spacing.lg },
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
}));

export function ManageProfilesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const { profiles, canCreate, maxProfiles } = useProfiles();

  const onEdit = (profile: Profile) =>
    router.push({ pathname: '/edit/[profileId]', params: { profileId: profile.id } });

  const onAdd = () =>
    router.push({ pathname: '/edit/[profileId]', params: { profileId: 'new' } });

  return (
    <Screen
      scroll
      padded={false}
      header={<ScreenHeader title={t('profiles.manage')} onBack={() => router.back()} />}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.grid}>
        {profiles.map((profile) => (
          <ProfileTile key={profile.id} profile={profile} onPress={onEdit} editing />
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

      {!canCreate ? (
        <AppText variant="caption" color="textMuted" align="center">
          {t('profiles.limitInfo', { max: maxProfiles })}
        </AppText>
      ) : null}

      <View style={{ marginTop: 24 }}>
        <Button label={t('common.done')} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}