import { View } from 'react-native';

import { PosterCard, type TitleId } from '@/features/catalog';
import type { PosterCardTitle } from '@/features/catalog/presentation/components/PosterCard';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

type Top10CardProps = {
  rank: number;
  title: PosterCardTitle;
  width: number;
  onPress: (id: TitleId) => void;
};

export function Top10Card({ rank, title, width, onPress }: Top10CardProps) {
  const { colors } = useTheme();
  const posterWidth = Math.round(width * 0.68);

  return (
    <View style={{ width, flexDirection: 'row', alignItems: 'flex-end' }}>
      <AppText
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          fontSize: 104,
          lineHeight: 112,
          fontWeight: '900',
          letterSpacing: -8,
          color: colors.textMuted,
          marginRight: -4,
          includeFontPadding: false,
        }}
      >
        {rank}
      </AppText>
      <PosterCard title={title} width={posterWidth} label={`${rank}. ${title.name}`} onPress={onPress} />
    </View>
  );
}