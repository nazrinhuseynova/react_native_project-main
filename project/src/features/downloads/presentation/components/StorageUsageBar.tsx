import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { formatBytes } from '@/core/utils/formatBytes';
import { progressA11y } from '@/shared/a11y/accessibilityProps';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

import { useStorageUsage } from '../../application/hooks/useStorageUsage';

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden' as const,
  },
  fill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.primary },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: spacing.xs,
  },
}));

export function StorageUsageBar() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { usedBytes, freeBytes, usedFraction } = useStorageUsage();

  return (
    <View {...progressA11y(t('downloads.storage'), usedFraction)}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(usedFraction * 100, usedBytes > 0 ? 2 : 0)}%` }]} />
      </View>
      <View style={styles.row}>
        <AppText variant="caption" color="textSecondary">
          {t('downloads.used', { size: formatBytes(usedBytes) })}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {t('downloads.free', { size: formatBytes(freeBytes) })}
        </AppText>
      </View>
    </View>
  );
}