import { View } from 'react-native';

import { BackdropCard, type TitleId } from '@/features/catalog';
import { useTheme } from '@/shared/theme/useTheme';

import type { HomeEntry } from '../../domain/HomeRow';

type ContinueWatchingCardProps = {
  entry: HomeEntry;
  width: number;
  onPress: (id: TitleId) => void;
};

export function ContinueWatchingCard({ entry, width, onPress }: ContinueWatchingCardProps) {
  const { colors } = useTheme();
  const percent = Math.round(Math.min(Math.max(entry.progress ?? 0, 0), 1) * 100);

  return (
    <BackdropCard title={entry.title} width={width} onPress={onPress}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          backgroundColor: 'rgba(255,255,255,0.3)',
        }}
      >
        <View style={{ width: `${percent}%`, height: '100%', backgroundColor: colors.primary }} />
      </View>
    </BackdropCard>
  );
}