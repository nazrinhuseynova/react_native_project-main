import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { toRouteParams, type TitleId } from '@/features/catalog';
import { useActiveProfile } from '@/features/profiles';
import { useTheme } from '@/shared/theme/useTheme';
import { Screen } from '@/shared/ui/Screen';

import { useCategoryFilter } from '../../application/hooks/useCategoryFilter';
import { useHeroTitle } from '../../application/hooks/useHeroTitle';
import { useHomeRows } from '../../application/hooks/useHomeRows';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { HeroBanner } from '../components/HeroBanner';
import { HeroSkeleton, HomeSkeleton } from '../components/HomeSkeleton';
import { HomeRowSection } from '../components/HomeRowSection';
import { KidsHomeScreen } from './KidsHomeScreen';

export function HomeScreen() {
  const { activeProfile } = useActiveProfile();
  return activeProfile?.isKids ? <KidsHomeScreen /> : <StandardHome />;
}

function StandardHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const { category, options, select, isSelected } = useCategoryFilter();
  const { context, visibleRows, hasMore, loadMore, refreshing, onRefresh } = useHomeRows(category);
  const hero = useHeroTitle(category);

  const openTitle = useCallback(
    (id: TitleId) => router.push({ pathname: '/movie/[id]', params: toRouteParams(id) }),
    [router],
  );

  const play = useCallback(
    (id: TitleId) => router.push({ pathname: '/player/[id]', params: toRouteParams(id) }),
    [router],
  );

  const header = (
    <View>
      <CategoryFilterBar options={options} isSelected={isSelected} onSelect={select} />
      {hero.title ? (
        <HeroBanner
          title={hero.title}
          genreNames={hero.genreNames}
          isSaved={hero.isSaved}
          onPlay={() => play(hero.title!.id)}
          onToggleSaved={hero.toggleSaved}
          onPressInfo={() => openTitle(hero.title!.id)}
        />
      ) : hero.isLoading ? (
        <HeroSkeleton />
      ) : null}
    </View>
  );

  return (
    <Screen padded={false}>
      {context ? (
        <FlatList
          data={visibleRows}
          keyExtractor={(row) => row.id}
          ListHeaderComponent={header}
          renderItem={({ item }) => (
            <HomeRowSection row={item} context={context} onPressTitle={openTitle} />
          )}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        />
      ) : (
        <HomeSkeleton />
      )}
    </Screen>
  );
}