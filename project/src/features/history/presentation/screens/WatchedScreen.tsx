import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { toRouteParams, type TitleId } from '@/features/catalog';
import { useRefresh } from '@/shared/hooks/useRefresh';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useClearHistory } from '../../application/hooks/useClearHistory';
import { useWatchedTitles } from '../../application/hooks/useWatchedTitles';
import { ClearHistoryDialog } from '../components/ClearHistoryDialog';
import { HistoryRow } from '../components/HistoryRow';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { flex: 1 },
  skeletons: { gap: spacing.md, padding: spacing.lg },
}));

export function WatchedScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();

  const { items, isLoading, isError, refetch } = useWatchedTitles();
  const { clearAll, isClearing, removeOne } = useClearHistory();
  const { refreshing, onRefresh } = useRefresh(refetch);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openTitle = (id: TitleId) =>
    router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });

  let body;
  if (isLoading) {
    body = (
      <View style={styles.skeletons}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} height={72} radius={8} />
        ))}
      </View>
    );
  } else if (isError) {
    body = <ErrorState title={t('history.error')} retryLabel={t('history.retry')} onRetry={() => void refetch()} />;
  } else if (items.length === 0) {
    body = <EmptyState icon="eye-off-outline" title={t('history.empty.title')} message={t('history.empty.message')} />;
  } else {
    body = (
      <FlatList
        data={items}
        keyExtractor={(item) => item.progress.titleId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => <HistoryRow item={item} onPress={openTitle} onRemove={removeOne} />}
      />
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <AppText variant="title2" style={styles.title} numberOfLines={1}>
          {t('history.watched.title')}
        </AppText>
        {items.length > 0 ? (
          <IconButton
            icon="trash-outline"
            accessibilityLabel={t('history.clear')}
            onPress={() => setDialogOpen(true)}
          />
        ) : null}
      </View>
      {body}
      <ClearHistoryDialog
        visible={dialogOpen}
        loading={isClearing}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => clearAll(undefined, { onSuccess: () => setDialogOpen(false) })}
      />
    </Screen>
  );
}