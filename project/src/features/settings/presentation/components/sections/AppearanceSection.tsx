import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { SegmentedControl, type SegmentOption } from '@/shared/ui/SegmentedControl';

import { useThemePreference } from '../../../appplication/hooks/useThemePreference';
import type { ThemePreference } from '../../../domain/entities/AppSettings';

export function AppearanceSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { preference, setPreference } = useThemePreference();

  const options: SegmentOption<ThemePreference>[] = [
    { value: 'system', label: t('settings.appearance.system') },
    { value: 'light', label: t('settings.appearance.light') },
    { value: 'dark', label: t('settings.appearance.dark') },
  ];

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={t('settings.appearance.title')} />
      <SegmentedControl options={options} value={preference} onChange={setPreference} />
    </View>
  );
}