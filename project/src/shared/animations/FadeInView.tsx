import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
 
import { useReduceMotion } from '../a11y/useReduceMotion';
import { timing } from './presets';
 
interface FadeInViewProps {
  children?: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
}
 
export function FadeInView({ children, delay = 0, duration, translateY = 12, style }: FadeInViewProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);
 
  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: duration ?? timing.slow.duration, easing: timing.slow.easing }),
    );
  }, [delay, duration, progress, reduceMotion]);
 
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * translateY }],
  }));
 
  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
