import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
 
import { useReduceMotion } from '../a11y/useReduceMotion';
import { useTheme } from '../theme/useTheme';
 
interface ShimmerViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}
 
export function ShimmerView({ width = '100%', height = 16, borderRadius = 8, style }: ShimmerViewProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const opacity = useSharedValue(1);
 
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    opacity.value = withRepeat(withTiming(0.45, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);
 
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
 
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius, backgroundColor: colors.skeleton }, animatedStyle, style]}
    />
  );
}
