import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';

const useStyles = makeStyles(({ colors, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  active: { width: 24, backgroundColor: colors.primary },
}));

type PageDotsProps = {
  count: number;
  activeIndex: number;
};

export function PageDots({ count, activeIndex }: PageDotsProps) {
  const styles = useStyles();

  return (
    <View
      accessible
      accessibilityLabel={`${activeIndex + 1} / ${count}`}
      style={styles.row}
    >
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.dot, index === activeIndex && styles.active]} />
      ))}
    </View>
  );
}