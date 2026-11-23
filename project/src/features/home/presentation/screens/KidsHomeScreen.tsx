import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { toRouteParams, type TitleId } from '@/features/catalog';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Screen } from '@/shared/ui/Screen';

import { useHeroTitle } from '../../application/hooks/useHeroTitle';
import { useHomeRows } from '../../application/hooks/useHomeRows';
import { ALL_CATEGORY } from '../../domain/CategoryFilter';
import { HeroBanner } from '../components/HeroBanner';
import { HeroSkeleton, HomeSkeleton } from '../components/HomeSkeleton';
import { HomeRowSection } from '../components/HomeRowSection';

const KIDS_SCALE = 1.25;
export function KidsHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { context, visibleRows, hasMore, loadMore, refreshing, onRefresh } = useHomeRows(ALL_CATEGORY);
  const hero = useHeroTitle(ALL_CATEGORY);

  const openTitle = useCallback(
    (id: TitleId) => router.push({ pathname: '/movie/[id]', params: toRouteParams(id) }),
    [router],
  );

  const header = (
    <View>
      <AppText variant="title1" color="primary" style={{ padding: spacing.lg }}>
        {t('home.kids.title')}
      </AppText>
      {hero.title ? (
        <HeroBanner
          title={hero.title}
          genreNames={hero.genreNames}
          isSaved={hero.isSaved}
          onPlay={() => router.push({ pathname: '/player/[id]', params: toRouteParams(hero.title!.id) })}
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
            <HomeRowSection row={item} context={context} scale={KIDS_SCALE} onPressTitle={openTitle} />
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