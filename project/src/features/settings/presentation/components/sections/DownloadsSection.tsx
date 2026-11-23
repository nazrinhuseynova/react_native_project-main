import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { DownloadQuality } from '@/features/downloads';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { SegmentedControl, type SegmentOption } from '@/shared/ui/SegmentedControl';
import { SwitchRow } from '@/shared/ui/SwitchRow';

import { useSettings } from '../../../appplication/hooks/useSettings';
import { FOR_YOU_LIMITS_GB } from '../../../domain/entities/AppSettings';

export function DownloadsSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { settings, update } = useSettings();

  const qualityOptions: SegmentOption<DownloadQuality>[] = [
    { value: 'standard', label: t('downloads.quality.standard') },
    { value: 'high', label: t('downloads.quality.high') },
  ];
  const limitOptions: SegmentOption<string>[] = FOR_YOU_LIMITS_GB.map((gb) => ({
    value: String(gb),
    label: t('settings.downloads.gb', { count: gb }),
  }));

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionHeader title={t('settings.downloads.title')} />
      <SwitchRow
        label={t('settings.downloads.wifiOnly')}
        description={t('settings.downloads.wifiOnlyHint')}
        value={settings.wifiOnlyDownloads}
        onValueChange={(wifiOnlyDownloads) => update({ wifiOnlyDownloads })}
      />
      <SwitchRow
        label={t('settings.downloads.smart')}
        description={t('settings.downloads.smartHint')}
        value={settings.smartDownloads}
        onValueChange={(smartDownloads) => update({ smartDownloads })}
      />
      <AppText variant="callout" color="textSecondary">
        {t('settings.downloads.quality')}
      </AppText>
      <SegmentedControl
        options={qualityOptions}
        value={settings.downloadQuality}
        onChange={(downloadQuality) => update({ downloadQuality })}
      />
      <AppText variant="callout" color="textSecondary">
        {t('settings.downloads.forYou')}
      </AppText>
      <SegmentedControl
        options={limitOptions}
        value={String(settings.downloadsForYouGb)}
        onChange={(value) => update({ downloadsForYouGb: Number(value) })}
      />
      <AppText variant="caption" color="textMuted">
        {t('settings.downloads.forYouHint')}
      </AppText>
    </View>
  );
}