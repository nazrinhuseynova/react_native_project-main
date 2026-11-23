import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { StatsOverview } from '@/features/stats';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { useToast } from '@/shared/ui/ToastProvider';

import { useActiveProfile } from '../../application/hooks/useActiveProfile';
import { useAvatarPicker } from '../../application/hooks/useAvatarPicker';
import { useProfiles } from '../../application/hooks/useProfiles';
import { ProfileAvatar } from '../components/ProfileAvatar';

const useStyles = makeStyles(({ spacing }) => ({
  head: {
    alignItems: 'center' as const,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  section: { marginTop: spacing.xl },
}));

export function ProfileTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { user } = useAuth();
  const { activeProfile, clearActiveProfile } = useActiveProfile();
  const { updateProfile, isSaving } = useProfiles();
  const picker = useAvatarPicker();

  const onChangePhoto = async () => {
    if (!activeProfile) return;
    const uri = await picker.pick();
    if (!uri) return;
    try {
      await updateProfile({
        id: activeProfile.id,
        patch: { avatar: { kind: 'upload', localUri: uri } },
      });
      toast.success(t('profiles.tab.photoUpdated'));
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    }
  };

  if (!activeProfile) return <Screen />;

  return (
    <Screen scroll>
      <View style={styles.head}>
        <ProfileAvatar profile={activeProfile} size={112} />
        <AppText variant="title2" style={{ marginTop: 12 }}>
          {activeProfile.name}
        </AppText>
        {user ? (
          <AppText variant="callout" color="textSecondary">
            {user.email}
          </AppText>
        ) : null}
        {activeProfile.isKids ? <Badge label={t('profiles.kidsBadge')} tone="info" /> : null}
      </View>

      <Button
        label={t('profiles.tab.changePhoto')}
        variant="secondary"
        leftIcon="camera-outline"
        loading={picker.isPicking || isSaving}
        onPress={() => void onChangePhoto()}
      />

      {picker.permissionDenied ? (
        <View style={{ marginTop: 12 }}>
          <AppText variant="callout" color="textSecondary" style={{ marginBottom: 8 }}>
            {t('profiles.avatar.denied')}
          </AppText>
          <Button
            label={t('profiles.avatar.openSettings')}
            size="sm"
            variant="secondary"
            fullWidth={false}
            onPress={picker.openSettings}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <Divider />
        <ListRow icon="person-circle-outline" title={t('profiles.tab.account')} onPress={() => router.push('/account')} />
        <Divider />
        {!activeProfile.isKids ? (
          <>
            <ListRow icon="shield-checkmark-outline" title={t('profiles.tab.parental')} onPress={() => router.push('/parental')} />
            <Divider />
          </>
        ) : null}
        <ListRow
          icon="swap-horizontal-outline"
          title={t('profiles.tab.switchProfile')}
          onPress={() => void clearActiveProfile()}
        />
        <Divider />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('profiles.tab.stats')} />
        <StatsOverview />
      </View>
    </Screen>
  );
}