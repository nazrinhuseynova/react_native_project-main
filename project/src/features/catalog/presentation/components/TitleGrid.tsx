import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View,
  type RefreshControlProps,
} from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';

import type { TitleId } from '../../domain/entities/TitleId';
import { PosterCard, type PosterCardTitle } from './PosterCard';

const COLUMNS = 3;

type TitleGridProps = {
  titles: readonly PosterCardTitle[];
  onPressTitle: (id: TitleId) => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  header?: ReactElement | null;
  refreshControl?: ReactElement<RefreshControlProps>;
};

export function TitleGrid({
  titles,
  onPressTitle,
  onEndReached,
  isLoadingMore = false,
  header,
  refreshControl,
}: TitleGridProps) {
  const { spacing, colors } = useTheme();
  const { width } = useWindowDimensions();
  const gap = spacing.md;
  const itemWidth = Math.floor((width - spacing.lg * 2 - gap * (COLUMNS - 1)) / COLUMNS);

  return (
    <FlatList
      data={titles}
      keyExtractor={(title) => title.id}
      numColumns={COLUMNS}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={{ padding: spacing.lg, gap, flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header ?? undefined}
      refreshControl={refreshControl}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      ListFooterComponent={() =>
        isLoadingMore ? (
          <View style={{ paddingVertical: spacing.lg }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      renderItem={({ item }) => <PosterCard title={item} width={itemWidth} onPress={onPressTitle} />}
    />
  );
} 