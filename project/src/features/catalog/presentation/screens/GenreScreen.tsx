import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useActiveProfile } from '@/features/profiles';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useDiscoverRow } from '../../application/hooks/useDiscoverRow';
import { useGenres } from '../../application/hooks/useGenres';
import { isMediaKind, toRouteParams, type MediaKind, type TitleId } from '../../domain/entities/TitleId';
import { TitleGrid } from '../components/TitleGrid';

const useStyles = makeStyles(({ spacing }) => ({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  skeletonGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.md,
    padding: spacing.lg,
  },
}));

export function GenreScreen() {
  const params = useLocalSearchParams<{ id: string; kind?: string; name?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { activeProfile } = useActiveProfile();

  const genreId = Number(params.id);
  const [kind, setKind] = useState<MediaKind>(isMediaKind(params.kind) ? params.kind : 'movie');
  const { names } = useGenres(kind);

  const query = useDiscoverRow(
    { type: 'byGenre', kind, genreId, kidsOnly: activeProfile?.isKids },
    { enabled: Number.isFinite(genreId) },
  );

  const title = params.name ?? names[genreId] ?? t('catalog.genre.title');

  const openTitle = (id: TitleId) =>
    router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <AppText variant="title2" style={{ flex: 1 }} numberOfLines={1}>
          {title}
        </AppText>
      </View>
      <SegmentedControl<MediaKind>
        value={kind}
        onChange={setKind}
        options={[
          { value: 'movie', label: t('catalog.genre.movies') },
          { value: 'tv', label: t('catalog.genre.tv') },
        ]}
      />
    </View>
  );

  let content;
  if (query.isLoading) {
    content = (
      <View style={styles.skeletonGrid}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} width="30%" height={150} radius={8} />
        ))}
      </View>
    );
  } else if (query.isError && query.titles.length === 0) {
    content = (
      <ErrorState
        message={t('errors.unknown')}
        onRetry={() => void query.refetch()}
        retryLabel={t('common.retry')}
      />
    );
  } else if (query.titles.length === 0) {
    content = <EmptyState title={t('catalog.empty.title')} message={t('catalog.empty.message')} />;
  } else {
    content = (
      <TitleGrid
        titles={query.titles}
        onPressTitle={openTitle}
        onEndReached={query.loadMore}
        isLoadingMore={query.isFetchingNextPage}
      />
    );
  }

  return (
    <Screen padded={false} header={header}>
      {content}
    </Screen>
  );
}