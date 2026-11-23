import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { useServices } from '@/bootstrap/useServices';
import { PosterCard, TitleGrid, toRouteParams, type TitleId } from '@/features/catalog';
import { useRefresh } from '@/shared/hooks/useRefresh';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { Skeleton } from '@/shared/ui/Skeleton';

import { DEFAULT_SORTER_ID } from '../../application/librarySortRegistry';
import { useLibraryQuery } from '../../application/hooks/useLibraryQuery';
import { useToggleFavorite } from '../../application/hooks/useToggleFavorite';
import { useToggleSaved } from '../../application/hooks/useToggleSaved';
import { useWatchStatus } from '../../application/hooks/useWatchStatus';
import type { LibraryTab } from '../../domain/entities/LibraryEntry';
import { LibraryGrid } from '../components/LibraryGrid';
import { LibraryToolbar } from '../components/LibraryToolbar';
import { StatusPicker } from '../components/StatusPicker';
import { SwipeToRemoveRow } from '../components/SwipeToRemoveRow';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  row: { flexDirection: 'row' as const, gap: spacing.md, padding: spacing.lg },
  rowText: { flex: 1, gap: spacing.sm },
  skeletons: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.md,
    padding: spacing.lg,
  },
}));

export function WatchlistScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const { library } = useServices();

  const [tab, setTab] = useState<LibraryTab>('saved');
  const [sorterId, setSorterId] = useState(DEFAULT_SORTER_ID);
  const [filterId, setFilterId] = useState<string | null>(null);

  const sorters = useMemo(() => library.sorters.all(), [library.sorters]);
  const filters = useMemo(() => library.filters.all(), [library.filters]);

  const { items, isLoading, isError, refetch } = useLibraryQuery({ tab, sorterId, filterId });
  const { set: setSaved } = useToggleSaved();
  const { set: setFavorite } = useToggleFavorite();
  const { set: setStatus } = useWatchStatus();
  const { refreshing, onRefresh } = useRefresh(refetch);

  const openTitle = (id: TitleId) =>
    router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });

  const refreshControl = (
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
  );

  const header = (
    <View style={styles.header}>
      <SegmentedControl<LibraryTab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'saved', label: t('library.tabs.saved') },
          { value: 'favorites', label: t('library.tabs.favorites') },
        ]}
      />
      <LibraryToolbar
        sorters={sorters}
        sorterId={sorterId}
        onSortChange={setSorterId}
        filters={filters}
        filterId={filterId}
        onFilterChange={setFilterId}
      />
    </View>
  );

  let body;
  if (isLoading) {
    body = (
      <View style={styles.skeletons}>
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} width={110} height={165} radius={8} />
        ))}
      </View>
    );
  } else if (isError) {
    body = <ErrorState title={t('library.error')} retryLabel={t('library.retry')} onRetry={() => void refetch()} />;
  } else if (items.length === 0) {
    body = (
      <EmptyState
        icon={tab === 'saved' ? 'bookmark-outline' : 'heart-outline'}
        title={t(`library.empty.${tab}.title`)}
        message={t(`library.empty.${tab}.message`)}
      />
    );
  } else if (tab === 'favorites') {
    body = <LibraryGrid items={items} onPressTitle={openTitle} refreshControl={refreshControl} />;
  } else {
    body = (
      <FlatList
        data={items}
        keyExtractor={(item) => item.entry.titleId}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SwipeToRemoveRow
            removeLabel={t('library.remove')}
            onRemove={() => setSaved(item.entry.titleId, false)}
          >
            <View style={styles.row}>
              <PosterCard title={item.title} width={84} onPress={openTitle} />
              <View style={styles.rowText}>
                <AppText variant="bodyStrong" numberOfLines={2}>
                  {item.title.name}
                </AppText>
                <StatusPicker
                  value={item.entry.watchStatus}
                  onChange={(status) => setStatus(item.entry.titleId, status)}
                />
              </View>
            </View>
          </SwipeToRemoveRow>
        )}
      />
    );
  }

  return (
    <Screen padded={false}>
      {header}
      {body}
    </Screen>
  );
}