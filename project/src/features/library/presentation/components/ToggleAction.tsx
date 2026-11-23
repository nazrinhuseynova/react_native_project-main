import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import type { IconName } from '@/shared/types/common';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';

type ToggleActionProps = {
  active: boolean;
  activeIcon: IconName;
  inactiveIcon: IconName;
  label: string;
  showLabel?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function ToggleAction({
  active,
  activeIcon,
  inactiveIcon,
  label,
  showLabel = false,
  disabled = false,
  onPress,
}: ToggleActionProps) {
  const { colors, spacing } = useTheme();
  const icon = active ? activeIcon : inactiveIcon;
  const color = active ? colors.primary : colors.text;

  if (!showLabel) {
    return (
      <IconButton
        icon={icon}
        color={color}
        selected={active}
        disabled={disabled}
        accessibilityLabel={label}
        onPress={onPress}
      />
    );
  }

  return (
    <ScalePressable
      {...buttonA11y(label, { selected: active, disabled })}
      disabled={disabled}
      onPress={onPress}
      haptic
      style={{ alignItems: 'center', minWidth: 64, paddingVertical: spacing.xs }}
    >
      <View>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <AppText variant="caption" color={active ? 'primary' : 'textSecondary'} style={{ marginTop: spacing.xs }}>
        {label}
      </AppText>
    </ScalePressable>
  );
}