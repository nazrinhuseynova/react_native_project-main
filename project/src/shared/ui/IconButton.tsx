import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
 
import { buttonA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
 
interface IconButtonProps {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  filled?: boolean;
  disabled?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}
 
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = 24,
  color,
  filled = false,
  disabled = false,
  selected,
  style,
}: IconButtonProps) {
  const { colors, sizes } = useTheme();
  const box = Math.max(sizes.hitSlop, size + 16);
 
  return (
    <ScalePressable
      {...buttonA11y(accessibilityLabel, { disabled, selected })}
      disabled={disabled}
      onPress={onPress}
      haptic
      hitSlop={8}
      style={[
        {
          width: box,
          height: box,
          borderRadius: box / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: filled ? colors.surfaceElevated : 'transparent',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={disabled ? colors.disabledText : (color ?? colors.text)} />
    </ScalePressable>
  );
}
