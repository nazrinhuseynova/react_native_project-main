import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { toRouteParams, type Title, type TitleId } from '@/features/catalog';
import { useRefresh } from '@/shared/hooks/useRefresh';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useEveryoneWatching } from '../../application/hooks/useEveryoneWatching';
import { useUpcoming } from '../../application/hooks/useUpcoming';
import { TabPills, type TabOption } from '../components/TabPills';
import { UpcomingCard } from '../components/UpcomingCard';

type Tab = 'comingSoon' | 'everyoneWatching' | 'top10';

const useStyles = makeStyles(({ spacing }) => ({
  title: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  list: { padding: spacing.lg, flexGrow: 1 },
  skeleton: { padding: spacing.lg, gap: spacing.lg },
}));

export function NewAndHotScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { colors, spacing } = useTheme();
  const [tab, setTab] = useState<Tab>('comingSoon');

  const upcoming = useUpcoming({ enabled: tab === 'comingSoon' });
  const everyone = useEveryoneWatching('everyone', tab === 'everyoneWatching');
  const top10 = useEveryoneWatching('top10', tab === 'top10');

  const active = tab === 'comingSoon' ? upcoming : tab === 'everyoneWatching' ? everyone : top10;
  const { refreshing, onRefresh } = useRefresh(active.refetch);

  const tabs: TabOption<Tab>[] = [
    { key: 'comingSoon', label: t('newhot.tabs.comingSoon') },
    { key: 'everyoneWatching', label: t('newhot.tabs.everyoneWatching') },
    { key: 'top10', label: t('newhot.tabs.top10') },
  ];

  const openTitle = (id: TitleId) =>
    router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });

  const header = (
    <View>
      <AppText variant="title1" style={styles.title}>
        {t('newhot.title')}
      </AppText>
      <TabPills tabs={tabs} value={tab} onChange={setTab} />
    </View>
  );

  let content;
  if (active.isLoading) {
    content = (
      <View style={styles.skeleton}>
        {[0, 1].map((key) => (
          <View key={key} style={{ gap: spacing.sm }}>
            <Skeleton height={190} radius={12} />
            <Skeleton width="60%" height={18} />
            <Skeleton height={44} />
          </View>
        ))}
      </View>
    );
  } else if (active.isError && active.titles.length === 0) {
    content = (
      <ErrorState
        message={t('errors.unknown')}
        onRetry={() => void active.refetch()}
        retryLabel={t('common.retry')}
      />
    );
  } else if (active.titles.length === 0) {
    content = (
      <EmptyState
        icon="calendar-outline"
        title={t('newhot.empty.title')}
        message={t('newhot.empty.message')}
      />
    );
  } else {
    content = (
      <FlatList<Title>
        data={active.titles}
        keyExtractor={(title) => title.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={active.loadMore}
        onEndReachedThreshold={0.6}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListFooterComponent={() =>
          active.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null
        }
        renderItem={({ item, index }) => (
          <UpcomingCard
            title={item}
            rank={tab === 'top10' ? index + 1 : undefined}
            showReminder={tab === 'comingSoon'}
            onPress={openTitle}
          />
        )}
      />
    );
  }

  return (
    <Screen padded={false} header={header}>
      {content}
    </Screen>
  );
}