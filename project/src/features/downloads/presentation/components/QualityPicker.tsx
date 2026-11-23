import { useTranslation } from 'react-i18next';

import { SegmentedControl } from '@/shared/ui/SegmentedControl';

import type { DownloadQuality } from '../../domain/entities/DownloadQuality';

type QualityPickerProps = {
  value: DownloadQuality;
  onChange: (value: DownloadQuality) => void;
};

export function QualityPicker({ value, onChange }: QualityPickerProps) {
  const { t } = useTranslation();

  return (
    <SegmentedControl<DownloadQuality>
      value={value}
      onChange={onChange}
      options={[
        { value: 'standard', label: t('downloads.quality.standard') },
        { value: 'high', label: t('downloads.quality.high') },
      ]}
    />
  );
}