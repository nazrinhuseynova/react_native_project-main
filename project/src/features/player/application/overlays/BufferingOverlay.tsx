import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';

import type { OverlayContext, PlayerOverlay } from './PlayerOverlay';

function BufferingSpinner() {
  const { colors } = useTheme();
  return (
    <View pointerEvents="none" style={styles.center}>
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const bufferingOverlay: PlayerOverlay = {
  id: 'buffering',
  order: 0,
  shouldShow: (ctx: OverlayContext) => ctx.isBuffering,
  Component: BufferingSpinner,
};