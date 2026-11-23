import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Chip } from '@/shared/ui/Chip';

export const DELETION_REASONS = [
  'too_expensive',
  'not_using',
  'missing_content',
  'privacy',
  'other',
] as const;

export type DeletionReason = (typeof DELETION_REASONS)[number];

type DeletionReasonPickerProps = {
  value: DeletionReason | null;
  onChange: (reason: DeletionReason | null) => void;
};

export function DeletionReasonPicker({ value, onChange }: DeletionReasonPickerProps) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {DELETION_REASONS.map((reason) => (
        <Chip
          key={reason}
          label={t(`account.reasons.${reason}`)}
          selected={value === reason}
          onPress={() => onChange(value === reason ? null : reason)}
        />
      ))}
    </View>
  );
}