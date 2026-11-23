import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { titleIdFromRoute } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { ErrorState } from '@/shared/ui/ErrorState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useMyReview } from '../../application/hooks/useMyReview';
import { useSubmitReview } from '../../application/hooks/useSubmitReview';
import { ReviewForm } from '../components/ReviewForm';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  title: { flex: 1 },
  body: { paddingTop: spacing.xl },
}));

function EditReviewContent({ titleId }: { titleId: NonNullable<ReturnType<typeof titleIdFromRoute>> }) {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { review, isLoading } = useMyReview(titleId);
  const submit = useSubmitReview(titleId);

  return (
    <Screen scroll keyboardAvoiding>
      <View style={styles.header}>
        <IconButton icon="close" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
        <AppText variant="title2" style={styles.title}>
          {review ? t('reviews.edit') : t('reviews.write')}
        </AppText>
      </View>
      <View style={styles.body}>
        {isLoading ? (
          <Skeleton height={240} radius={12} />
        ) : (
          <ReviewForm
            key={review?.id ?? 'new'}
            initialStars={review?.stars}
            initialText={review?.text}
            submitLabel={t('reviews.save')}
            isSubmitting={submit.isPending}
            onSubmit={(values) => submit.mutate(values, { onSuccess: () => router.back() })}
          />
        )}
      </View>
    </Screen>
  );
}

export function EditReviewScreen() {
  const params = useLocalSearchParams<{ id: string; type?: string }>();
  const { t } = useTranslation();
  const titleId = titleIdFromRoute(params.id, params.type);

  if (!titleId) {
    return (
      <Screen>
        <ErrorState title={t('reviews.error')} />
      </Screen>
    );
  }
  return <EditReviewContent titleId={titleId} />;
}