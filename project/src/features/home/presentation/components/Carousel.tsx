import { FlatList, View } from 'react-native';

import { BackdropCard, PosterCard, type TitleId } from '@/features/catalog';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { useTheme } from '@/shared/theme/useTheme';

import type { HomeEntry, HomeRowVariant } from '../../domain/HomeRow';
import { ContinueWatchingCard } from './ContinueWatchingCard';
import { Top10Card } from './Top10Card';

const BASE_WIDTH: Record<HomeRowVariant, number> = {
  poster: 118,
  backdrop: 240,
  top10: 150,
  continue: 220,
};

type CarouselProps = {
  title: string;
  entries: readonly HomeEntry[];
  variant: HomeRowVariant;
  scale?: number;
  onPressTitle: (id: TitleId) => void;
};

export function Carousel({ title, entries, variant, scale = 1, onPressTitle }: CarouselProps) {
  const { spacing } = useTheme();
  const width = Math.round(BASE_WIDTH[variant] * scale);

  return (
    <View style={{ marginTop: spacing.lg }}>
      <SectionHeader title={title} style={{ paddingHorizontal: spacing.lg }} />
      <FlatList
        data={entries}
        horizontal
        keyExtractor={(entry) => entry.title.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
        initialNumToRender={4}
        windowSize={5}
        renderItem={({ item, index }) => {
          switch (variant) {
            case 'backdrop':
              return <BackdropCard title={item.title} width={width} onPress={onPressTitle} />;
            case 'top10':
              return <Top10Card rank={index + 1} title={item.title} width={width} onPress={onPressTitle} />;
            case 'continue':
              return <ContinueWatchingCard entry={item} width={width} onPress={onPressTitle} />;
            default:
              return <PosterCard title={item.title} width={width} onPress={onPressTitle} />;
          }
        }}
      />
    </View>
  );
}