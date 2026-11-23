import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
 
import { buttonA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';
 
interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
 
export function Chip({ label, selected = false, onPress, icon, disabled = false, style }: ChipProps) {
  const { colors, radius, spacing, sizes } = useTheme();
  const foreground = selected ? colors.textOnPrimary : colors.text;
 
  return (
    <ScalePressable
      {...buttonA11y(label, { selected, disabled })}
      disabled={disabled}
      onPress={onPress}
      scaleTo={0.95}
      style={[
        styles.chip,
        {
          borderRadius: radius.pill,
          paddingHorizontal: spacing.lg,
          backgroundColor: selected ? colors.primary : colors.surfaceElevated,
          borderColor: selected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={sizes.iconSm} color={foreground} style={{ marginRight: spacing.xs }} /> : null}
        <AppText variant="callout" color={foreground} weight="600" numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </ScalePressable>
  );
}
 
const styles = StyleSheet.create({
  chip: { minHeight: 36, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
