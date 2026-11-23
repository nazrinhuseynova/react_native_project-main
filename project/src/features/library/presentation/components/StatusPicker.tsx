import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { Chip } from '@/shared/ui/Chip';

import { WATCH_STATUSES, type WatchStatus } from '../../domain/entities/WatchStatus';

const useStyles = makeStyles(({ spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.xs,
  },
}));

type StatusPickerProps = {
  value: WatchStatus;
  onChange: (status: WatchStatus) => void;
};

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      {WATCH_STATUSES.map((status) => (
        <Chip
          key={status}
          label={t(`library.status.${status}`)}
          selected={value === status}
          onPress={() => onChange(status)}
        />
      ))}
    </View>
  );
}