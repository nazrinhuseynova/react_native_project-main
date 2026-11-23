import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, type ReactNode } from 'react';
import { Animated, PanResponder, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

const REMOVE_THRESHOLD = 96;

type SwipeToRemoveRowProps = {
  children: ReactNode;
  removeLabel: string;
  onRemove: () => void;
};

export function SwipeToRemoveRow({ children, removeLabel, onRemove }: SwipeToRemoveRowProps) {
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dx < 0) translateX.setValue(gesture.dx);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -REMOVE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: -width,
              duration: 180,
              useNativeDriver: true,
            }).start(() => onRemove());
          } else {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        },
      }),
    [translateX, width, onRemove],
  );

  return (
    <View>
      <View style={[StyleSheet.absoluteFill, styles.background, { backgroundColor: colors.danger, paddingRight: spacing.xl }]}>
        <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
        <AppText variant="captionStrong" color="#FFFFFF">
          {removeLabel}
        </AppText>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{ backgroundColor: colors.background, transform: [{ translateX }] }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { alignItems: 'flex-end', justifyContent: 'center' },
});