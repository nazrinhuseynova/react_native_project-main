import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { AppLanguage } from '@/core/i18n/i18n';
import { useTheme } from '@/shared/theme/useTheme';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { SegmentedControl, type SegmentOption } from '@/shared/ui/SegmentedControl';

import { useSettings } from '../../../appplication/hooks/useSettings';

const OPTIONS: SegmentOption<AppLanguage>[] = [
  { value: 'az', label: 'Azərbaycanca' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
];

export function LanguageSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { settings, update } = useSettings();

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={t('settings.language.title')} />
      <SegmentedControl
        options={OPTIONS}
        value={settings.language}
        onChange={(language) => update({ language })}
      />
    </View>
  );
}