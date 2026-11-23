import { useWindowDimensions } from 'react-native';
 
export type Orientation = 'portrait' | 'landscape';
 
export function useOrientation() {
  const { width, height } = useWindowDimensions();
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';
 
  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    width,
    height,
  };
}
