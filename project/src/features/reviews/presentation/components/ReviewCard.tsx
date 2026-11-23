import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';
import { StarRating } from '@/shared/ui/StarRating';

import type { Review } from '../../domain/entities/Review';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  author: { flex: 1 },
  actions: { flexDirection: 'row' as const },
}));

type ReviewCardProps = {
  review: Review;
  isMine?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ReviewCard({ review, isMine = false, onEdit, onDelete }: ReviewCardProps) {
  const { t, i18n } = useTranslation();
  const styles = useStyles();
  const date = new Date(review.createdAt).toLocaleDateString(i18n.language);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.author}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {isMine ? t('reviews.mine') : review.authorName || t('reviews.anonymous')}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {date}
          </AppText>
        </View>
        {isMine ? (
          <View style={styles.actions}>
            {onEdit ? <IconButton icon="create-outline" size={20} accessibilityLabel={t('reviews.edit')} onPress={onEdit} /> : null}
            {onDelete ? <IconButton icon="trash-outline" size={20} accessibilityLabel={t('reviews.delete')} onPress={onDelete} /> : null}
          </View>
        ) : null}
      </View>
      <StarRating value={review.stars} readOnly size={16} />
      {review.text ? <AppText variant="body">{review.text}</AppText> : null}
    </View>
  );
}