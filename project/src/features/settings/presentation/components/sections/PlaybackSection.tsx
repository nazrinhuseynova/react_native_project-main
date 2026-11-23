import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { isFeatureEnabled } from '@/core/config/featureFlags';
import { useTheme } from '@/shared/theme/useTheme';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { SwitchRow } from '@/shared/ui/SwitchRow';

import { useSettings } from '../../../appplication/hooks/useSettings';

export function PlaybackSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { settings, update } = useSettings();

  return (
    <View style={{ gap: spacing.xs }}>
      <SectionHeader title={t('settings.playback.title')} />
      <SwitchRow
        label={t('settings.playback.autoplay')}
        description={t('settings.playback.autoplayHint')}
        value={settings.autoplay}
        onValueChange={(autoplay) => update({ autoplay })}
      />
      <SwitchRow
        label={t('settings.playback.dataSaver')}
        description={t('settings.playback.dataSaverHint')}
        value={settings.dataSaver}
        onValueChange={(dataSaver) => update({ dataSaver })}
      />
      {isFeatureEnabled('uiSounds') ? (
        <SwitchRow
          label={t('settings.playback.uiSounds')}
          value={settings.uiSounds}
          onValueChange={(uiSounds) => update({ uiSounds })}
        />
      ) : null}
    </View>
  );
}