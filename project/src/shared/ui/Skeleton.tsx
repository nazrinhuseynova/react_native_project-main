import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
 
import { ShimmerView } from '../animations/ShimmerView';
 
interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}
 
export function Skeleton({ width = '100%', height = 16, radius = 8, circle = false, style }: SkeletonProps) {
  if (circle && typeof height === 'number') {
    return <ShimmerView width={height} height={height} borderRadius={height / 2} style={style} />;
  }
 
  return <ShimmerView width={width} height={height} borderRadius={radius} style={style} />;
}
