import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/shared/theme/useTheme';

import type { GenreCount } from '../../domain/entities/WatchStats';

const ROW_HEIGHT = 32;
const BAR_HEIGHT = 14;
const LABEL_WIDTH = 96;
const COUNT_WIDTH = 28;
const MAX_ROWS = 5;

function truncate(label: string): string {
  return label.length > 13 ? `${label.slice(0, 12)}…` : label;
}

type GenreBarChartProps = {
  data: readonly GenreCount[];
};

export function GenreBarChart({ data }: GenreBarChartProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const rows = data.slice(0, MAX_ROWS);
  const max = Math.max(...rows.map((row) => row.count), 1);
  const barArea = Math.max(width - LABEL_WIDTH - COUNT_WIDTH, 0);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return (
    <View onLayout={onLayout}>
      {width > 0 ? (
        <Svg width={width} height={rows.length * ROW_HEIGHT}>
          {rows.map((row, index) => {
            const top = index * ROW_HEIGHT;
            const barY = top + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const barWidth = Math.max(4, (row.count / max) * barArea);

            return (
              <View key={row.id}>
                <SvgText x={0} y={top + ROW_HEIGHT / 2 + 4} fill={colors.textSecondary} fontSize={12}>
                  {truncate(row.name)}
                </SvgText>
                <Rect x={LABEL_WIDTH} y={barY} width={barArea} height={BAR_HEIGHT} rx={7} fill={colors.surfaceElevated} />
                <Rect x={LABEL_WIDTH} y={barY} width={barWidth} height={BAR_HEIGHT} rx={7} fill={colors.primary} />
                <SvgText
                  x={LABEL_WIDTH + barArea + 8}
                  y={top + ROW_HEIGHT / 2 + 4}
                  fill={colors.text}
                  fontSize={12}
                  fontWeight="600"
                >
                  {row.count}
                </SvgText>
              </View>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}