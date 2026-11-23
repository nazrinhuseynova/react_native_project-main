import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
 
import { buttonA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';
 
interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}
 
export function ListRow({
  title,
  subtitle,
  icon,
  left,
  right,
  onPress,
  showChevron,
  destructive = false,
  disabled = false,
  style,
}: ListRowProps) {
  const { colors, spacing, sizes } = useTheme();
  const tint = destructive ? colors.danger : colors.text;
  const chevron = showChevron ?? !!onPress;
 
  const content = (
    <>
      {left ??
        (icon ? (
          <Ionicons name={icon} size={sizes.iconMd} color={destructive ? colors.danger : colors.textSecondary} style={{ marginRight: spacing.md }} />
        ) : null)}
      <View style={{ flex: 1 }}>
        <AppText variant="body" color={tint}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.xxs }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: spacing.sm }} /> : null}
    </>
  );
 
  if (!onPress) {
    return <View style={[styles.row, { paddingVertical: spacing.md }, style]}>{content}</View>;
  }
 
  return (
    <ScalePressable
      {...buttonA11y(subtitle ? `${title}, ${subtitle}` : title, { disabled })}
      disabled={disabled}
      onPress={onPress}
      scaleTo={0.985}
      style={[styles.row, { paddingVertical: spacing.md, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {content}
    </ScalePressable>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
});
