import { Easing, FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
 
import { motion } from '../theme/tokens';
 
export const durations = motion.duration;
 
export const springs = motion.spring;
 
export const easings = {
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0, 1, 1),
} as const;
 
export const timing = {
  fast: { duration: durations.fast, easing: easings.standard },
  normal: { duration: durations.normal, easing: easings.standard },
  slow: { duration: durations.slow, easing: easings.decelerate },
} as const;
 
export const layoutPresets = {
  fadeIn: FadeIn.duration(durations.normal),
  fadeOut: FadeOut.duration(durations.fast),
  fadeInUp: FadeInUp.duration(durations.normal),
  fadeOutUp: FadeOutUp.duration(durations.fast),
  fadeInDown: FadeInDown.duration(durations.normal),
  fadeOutDown: FadeOutDown.duration(durations.fast),
} as const;
