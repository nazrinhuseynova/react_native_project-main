import { useTranslation } from 'react-i18next';

import { useServices } from '@/bootstrap/useServices';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Screen } from '@/shared/ui/Screen';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { settings } = useServices();
  const sections = settings.sections.all();

  return (
    <Screen contentContainerStyle={{ gap: spacing.xl, paddingBottom: spacing.xxxl }}>
      <AppText variant="title1">{t('settings.title')}</AppText>
      {sections.map((section) => {
        const Section = section.Component;
        return <Section key={section.id} />;
      })}
    </Screen>
  );
}