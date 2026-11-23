import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { APP_NAME } from '@/core/config/constants';
import { useReduceMotion } from '@/shared/a11y/useReduceMotion';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

export function LogoAnimation() {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }
    opacity.value = withTiming(1, { duration: 700 });
    scale.value = withSequence(
      withTiming(1.06, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 300 }),
    );
  }, [opacity, scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel={APP_NAME}
      style={[styles.container, animatedStyle]}
    >
      <AppText
        variant="display"
        color="primary"
        style={[styles.logo, { textShadowColor: colors.primary }]}
      >
        {APP_NAME.toUpperCase()}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  logo: {
    letterSpacing: 6,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
});