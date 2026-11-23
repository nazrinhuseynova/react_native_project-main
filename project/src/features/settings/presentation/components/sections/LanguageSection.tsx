import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { changeLanguage, type AppLanguage } from '@/core/i18n/i18n';
import { useAvailableLanguages } from '@/core/i18n/useAvailableLanguages';
import { useTheme } from '@/shared/theme/useTheme';
import { Chip } from '@/shared/ui/Chip';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { useToast } from '@/shared/ui/ToastProvider';

import { useSettings } from '../../../appplication/hooks/useSettings';

export function LanguageSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const toast = useToast();
  const { settings, update } = useSettings();
  const languages = useAvailableLanguages();
  const [busy, setBusy] = useState(false);

  const select = async (language: AppLanguage) => {
    if (busy || language === settings.language) return;
    setBusy(true);
    const ok = await changeLanguage(language);
    setBusy(false);

    if (ok) {
      update({ language });
    } else {
      toast.error(
        t('settings.language.downloadFailed', {
          defaultValue: 'Could not download the language. Check your connection.',
        }),
      );
    }
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={t('settings.language.title')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {languages.map((item) => (
          <Chip
            key={item.code}
            label={item.nativeName}
            selected={item.code === settings.language}
            disabled={busy}
            onPress={() => void select(item.code)}
          />
        ))}
      </View>
    </View>
  );
}