import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
 
import { buttonA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';
 
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
 
interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}
 
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors, radius, spacing, sizes } = useTheme();
  const inactive = disabled || loading;
 
  const height = size === 'sm' ? sizes.controlSm : size === 'lg' ? sizes.controlLg : sizes.controlMd;
 
  const palette = {
    primary: { bg: colors.primary, fg: colors.textOnPrimary, border: 'transparent' },
    secondary: { bg: colors.surfaceElevated, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
    danger: { bg: colors.danger, fg: '#FFFFFF', border: 'transparent' },
  }[variant];
 
  const background = inactive ? colors.disabled : palette.bg;
  const foreground = inactive ? colors.disabledText : palette.fg;
 
  return (
    <ScalePressable
      {...buttonA11y(label, { hint: accessibilityHint, disabled: inactive, busy: loading })}
      disabled={inactive}
      onPress={onPress}
      haptic
      style={[
        styles.base,
        {
          height,
          minHeight: sizes.controlSm,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.xl,
          borderRadius: radius.md,
          backgroundColor: background,
          borderColor: inactive ? 'transparent' : palette.border,
          borderWidth: palette.border === 'transparent' ? 0 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color={foreground} />
        ) : leftIcon ? (
          <Ionicons name={leftIcon} size={sizes.iconMd} color={foreground} style={{ marginRight: spacing.sm }} />
        ) : null}
        <AppText variant={size === 'sm' ? 'bodyStrong' : 'button'} color={foreground} numberOfLines={1}>
          {label}
        </AppText>
        {!loading && rightIcon ? (
          <Ionicons name={rightIcon} size={sizes.iconMd} color={foreground} style={{ marginLeft: spacing.sm }} />
        ) : null}
      </View>
    </ScalePressable>
  );
}
 
const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
