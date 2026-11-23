import { View, type StyleProp, type ViewStyle } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
 
interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}
 
export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const { colors, radius, spacing } = useTheme();
 
  const map = {
    neutral: { bg: colors.surfaceElevated, fg: colors.textSecondary },
    primary: { bg: colors.primary, fg: colors.textOnPrimary },
    success: { bg: colors.success, fg: '#0B0B0F' },
    warning: { bg: colors.warning, fg: '#0B0B0F' },
    danger: { bg: colors.danger, fg: '#FFFFFF' },
    info: { bg: colors.info, fg: '#0B0B0F' },
  }[tone];
 
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[
        {
          alignSelf: 'flex-start',
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs + 1,
          borderRadius: radius.xs,
          backgroundColor: map.bg,
        },
        style,
      ]}
    >
      <AppText variant="overline" color={map.fg} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}
