import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export function PrivacySection() {
  const { t } = useTranslation();
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <SectionHeader title={t('settings.privacy.title')} />
      <ListRow
        icon="shield-checkmark-outline"
        title={t('settings.privacy.parental')}
        onPress={() => router.push('/parental')}
        showChevron
      />
      <ListRow
        icon="person-circle-outline"
        title={t('settings.privacy.account')}
        onPress={() => router.push('/account')}
        showChevron
      />
      <ListRow
        icon="phone-portrait-outline"
        title={t('settings.privacy.devices')}
        onPress={() => router.push('/account/devices')}
        showChevron
      />
    </View>
  );
}