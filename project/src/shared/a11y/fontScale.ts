import { PixelRatio, useWindowDimensions } from 'react-native';
 
export const MAX_FONT_SCALE = 1.6;
 
export function getFontScale(): number {
  return PixelRatio.getFontScale();
}
 
export function scaleFont(size: number, maxScale: number = MAX_FONT_SCALE): number {
  return size * Math.min(getFontScale(), maxScale);
}
 
export function useFontScale(maxScale: number = MAX_FONT_SCALE): number {
  const { fontScale } = useWindowDimensions();
  return Math.min(fontScale, maxScale);
}
 
export function useIsLargeFont(threshold = 1.3): boolean {
  const { fontScale } = useWindowDimensions();
  return fontScale >= threshold;
}
