import { Text, type TextProps, type TextStyle } from 'react-native';
 
import { MAX_FONT_SCALE } from '../a11y/fontScale';
import type { Palette } from '../theme/palettes/dark';
import type { TypographyVariant } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
 
export type TextColor = 'text' | 'textSecondary' | 'textMuted' | 'textOnPrimary' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'star';
 
export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: TextColor | (string & {});
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
  uppercase?: boolean;
  maxFontScale?: number;
}
 
export function AppText({
  variant = 'body',
  color = 'text',
  align,
  weight,
  uppercase,
  maxFontScale = MAX_FONT_SCALE,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors, typography } = useTheme();
  const resolvedColor = color in colors ? colors[color as keyof Palette] : color;
 
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={maxFontScale}
      {...rest}
      style={[
        typography[variant],
        { color: resolvedColor as string },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        uppercase ? { textTransform: 'uppercase' } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}
