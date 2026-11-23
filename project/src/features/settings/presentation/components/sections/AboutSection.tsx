import * as Application from 'expo-application';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { TmdbAttribution } from '@/features/catalog';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export function AboutSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const version = Application.nativeApplicationVersion ?? '1.0.0';

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={t('settings.about.title')} />
      <AppText variant="callout" color="textSecondary">
        {t('settings.about.version', { version })}
      </AppText>
   
      <TmdbAttribution />
    </View>
  );
}