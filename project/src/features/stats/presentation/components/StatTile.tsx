import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import type { IconName } from '@/shared/types/common';
import { AppText } from '@/shared/ui/AppText';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
}));

type StatTileProps = {
  icon: IconName;
  value: string;
  label: string;
};

export function StatTile({ icon, value, label }: StatTileProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.tile}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <AppText variant="title2" numberOfLines={1}>
        {value}
      </AppText>
      <AppText variant="caption" color="textSecondary" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}