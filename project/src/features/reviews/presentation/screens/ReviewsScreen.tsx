import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { titleIdFromRoute, toRouteParams } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useDeleteReview } from '../../application/hooks/useDeleteReview';
import { useMyReview } from '../../application/hooks/useMyReview';
import { useReaction } from '../../application/hooks/useReaction';
import { useReviews } from '../../application/hooks/useReviews';
import { RatingSummary } from '../components/RatingSummary';
import { ReactionButtons } from '../components/ReactionButtons';
import { ReviewCard } from '../components/ReviewCard';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { flex: 1 },
  top: { gap: spacing.lg, paddingBottom: spacing.md },
  list: { padding: spacing.lg, gap: spacing.md },
}));

export function ReviewsScreen() {
  const params = useLocalSearchParams<{ id: string; type?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();

  const titleId = titleIdFromRoute(params.id, params.type);
  const { reviews, summary, isLoading, isError, refetch } = useReviews(titleId);
  const { review: mine, userId } = useMyReview(titleId);
  const { reaction, select } = useReaction(titleId ?? 'movie:0');
  const remove = useDeleteReview();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!titleId) {
    return (
      <Screen>
        <ErrorState title={t('reviews.error')} />
      </Screen>
    );
  }

  const openEditor = () =>
    router.push({ pathname: '/movie/[id]/edit-review', params: toRouteParams(titleId) });

  const others = reviews.filter((review) => review.userId !== userId);

  const top = (
    <View style={styles.top}>
      <RatingSummary summary={summary} />
      <ReactionButtons value={reaction} onSelect={select} />
      <Button
        label={mine ? t('reviews.edit') : t('reviews.write')}
        leftIcon={mine ? 'create-outline' : 'star-outline'}
        onPress={openEditor}
      />
      {mine ? (
        <ReviewCard
          review={mine}
          isMine
          onEdit={openEditor}
          onDelete={() => setConfirmOpen(true)}
        />
      ) : null}
    </View>
  );

  let body;
  if (isLoading) {
    body = (
      <View style={styles.list}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height={96} radius={12} />
        ))}
      </View>
    );
  } else if (isError) {
    body = <ErrorState title={t('reviews.error')} retryLabel={t('reviews.retry')} onRetry={() => void refetch()} />;
  } else {
    body = (
      <FlatList
        data={others}
        keyExtractor={(review) => review.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={top}
        ListEmptyComponent={
          mine ? undefined : (
            <EmptyState
              icon="chatbubbles-outline"
              title={t('reviews.empty.title')}
              message={t('reviews.empty.message')}
            />
          )
        }
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
    );
  }

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <AppText variant="title2" style={styles.title}>
          {t('reviews.title')}
        </AppText>
      </View>
      {body}
      <ConfirmDialog
        visible={confirmOpen}
        destructive
        loading={remove.isPending}
        title={t('reviews.deleteConfirm.title')}
        message={t('reviews.deleteConfirm.message')}
        confirmLabel={t('reviews.delete')}
        cancelLabel={t('reviews.cancel')}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (!mine) return;
          remove.mutate(mine.id, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </Screen>
  );
}