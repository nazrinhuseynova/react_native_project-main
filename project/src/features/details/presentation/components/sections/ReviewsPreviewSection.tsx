import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toRouteParams } from '@/features/catalog';
import { RatingSummary, ReviewCard, useReviews } from '@/features/reviews';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';

const PREVIEW_COUNT = 2;

const useStyles = makeStyles(({ spacing }) => ({
  list: { marginTop: spacing.md, gap: spacing.md },
}));

export function ReviewsPreviewSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { title } = details;
  const { reviews, summary, isLoading } = useReviews(title.id);

  return (
    <View>
      <SectionHeader
        title={t('details.reviews')}
        actionLabel={t('details.seeAll')}
        onAction={() => router.push({ pathname: '/movie/[id]/reviews', params: toRouteParams(title.id) })}
      />
      {isLoading ? null : summary.count === 0 ? (
        <AppText variant="callout" color="textMuted">
          {t('details.noReviews')}
        </AppText>
      ) : (
        <>
          <RatingSummary summary={summary} compact />
          <View style={styles.list}>
            {reviews.slice(0, PREVIEW_COUNT).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}