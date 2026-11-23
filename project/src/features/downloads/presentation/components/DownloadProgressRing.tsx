import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { progressA11y } from '@/shared/a11y/accessibilityProps';
import { useTheme } from '@/shared/theme/useTheme';

type DownloadProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
};

export function DownloadProgressRing({ progress, size = 28, strokeWidth = 3, children }: DownloadProgressRingProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      {...progressA11y('Download progress', clamped)}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - clamped)}
          strokeLinecap="round"
        />
      </Svg>
      {children}
    </View>
  );
}