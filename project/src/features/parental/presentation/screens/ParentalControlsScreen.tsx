import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useActiveProfile, useProfiles } from '@/features/profiles';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Chip } from '@/shared/ui/Chip';
import { Divider } from '@/shared/ui/Divider';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/ToastProvider';

import { useParentalSettings } from '../../application/hooks/useParentalSettings';
import { MaturityPicker } from '../components/MaturityPicker';

const useStyles = makeStyles(({ spacing }) => ({
  chips: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: { marginTop: spacing.lg },
}));

export function ParentalControlsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { activeProfile } = useActiveProfile();
  const { profiles } = useProfiles();

  const [targetId, setTargetId] = useState<string | null>(null);
  const target = profiles.find((profile) => profile.id === (targetId ?? activeProfile?.id)) ?? activeProfile;

  const { settings, isLoading, isError, refetch, setMaxMaturity, isSaving } = useParentalSettings(
    target?.id,
  );

  const header = <ScreenHeader title={t('parental.title')} onBack={() => router.back()} />;

  // Kids profili valideyn ayarlarını dəyişə bilməz.
  if (activeProfile?.isKids) {
    return (
      <Screen header={header}>
        <EmptyState
          icon="lock-closed-outline"
          title={t('parental.kidsLocked.title')}
          message={t('parental.kidsLocked.message')}
        />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen header={header}>
        <ErrorState message={t('errors.unknown')} onRetry={() => void refetch()} retryLabel={t('common.retry')} />
      </Screen>
    );
  }

  return (
    <Screen scroll header={header}>
      <AppText variant="callout" color="textSecondary" style={{ marginBottom: 16 }}>
        {t('parental.subtitle')}
      </AppText>

      {profiles.length > 1 ? (
        <View style={styles.chips}>
          {profiles.map((profile) => (
            <Chip
              key={profile.id}
              label={profile.name}
              selected={profile.id === target?.id}
              onPress={() => setTargetId(profile.id)}
            />
          ))}
        </View>
      ) : null}

      {target ? (
        <AppText variant="bodyStrong">{t('parental.profileFor', { name: target.name })}</AppText>
      ) : null}

      {target?.isKids ? (
        <AppText variant="caption" color="textMuted" style={{ marginTop: 4 }}>
          {t('parental.kidsInfo')}
        </AppText>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title={t('parental.maxMaturity')} />
        <AppText variant="caption" color="textMuted" style={{ marginBottom: 8 }}>
          {t('parental.maxMaturityHint')}
        </AppText>

        {isLoading || !settings ? (
          <Skeleton height={220} />
        ) : (
          <MaturityPicker
            value={settings.maxMaturity}
            disabled={isSaving}
            onChange={(rating) =>
              setMaxMaturity(rating).catch((error: unknown) => toast.error(t(toUserMessage(error))))
            }
          />
        )}
      </View>

      <View style={styles.section}>
        <Divider />
        <ListRow
          icon="eye-off-outline"
          title={t('parental.blocked.row')}
          subtitle={t('parental.blocked.count', { count: settings?.blockedTitles.length ?? 0 })}
          onPress={() =>
            router.push({
              pathname: '/parental/blocked-titles',
              params: target ? { profileId: target.id } : {},
            })
          }
        />
        <Divider />
      </View>
    </Screen>
  );
}