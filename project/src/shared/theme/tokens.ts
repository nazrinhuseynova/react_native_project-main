import type { TextStyle } from 'react-native';
 
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;
 
export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;
 
export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  letterSpacing?: number;
}
 
export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.5 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.3 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  headline: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  callout: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  captionStrong: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.8 },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
} as const satisfies Record<string, TypographyStyle>;
 
export type TypographyVariant = keyof typeof typography;
 
export const motion = {
  duration: {
    instant: 80,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },
  spring: {
    gentle: { damping: 20, stiffness: 180, mass: 1 },
    snappy: { damping: 18, stiffness: 320, mass: 0.8 },
  },
  pressScale: 0.96,
} as const;
 
export const sizes = {
  hitSlop: 44,
  iconSm: 16,
  iconMd: 22,
  iconLg: 28,
  controlSm: 36,
  controlMd: 48,
  controlLg: 56,
  inputHeight: 52,
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 72,
  avatarXl: 112,
} as const;
 
export const elevation = {
  none: {
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
} as const;
 
export const tokens = {
  spacing,
  radius,
  typography,
  motion,
  sizes,
  elevation,
} as const;
 
export type Tokens = typeof tokens;
