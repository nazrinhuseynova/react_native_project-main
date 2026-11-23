import * as Haptics from 'expo-haptics';
import { Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
 
import { useReduceMotion } from '../a11y/useReduceMotion';
import { motion } from '../theme/tokens';
import { springs } from './presets';
 
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
 
export interface ScalePressableProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}
 
export function ScalePressable({
  scaleTo = motion.pressScale,
  haptic = false,
  style,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  children,
  ...rest
}: ScalePressableProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
 
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
 
  const handlePressIn = (event: GestureResponderEvent) => {
    if (!reduceMotion) scale.value = withSpring(scaleTo, springs.snappy);
    onPressIn?.(event);
  };
 
  const handlePressOut = (event: GestureResponderEvent) => {
    if (!reduceMotion) scale.value = withSpring(1, springs.snappy);
    onPressOut?.(event);
  };
 
  const handlePress = (event: GestureResponderEvent) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    onPress?.(event);
  };
 
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
