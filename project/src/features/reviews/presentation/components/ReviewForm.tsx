import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { StarRating } from '@/shared/ui/StarRating';
import { TextField } from '@/shared/ui/TextField';

import { reviewSchema, type ReviewFormValues } from '../../application/schemas/reviewSchema';
import { REVIEW_TEXT_MAX } from '../../domain/policies/ReviewPolicy';

const useStyles = makeStyles(({ spacing }) => ({
  root: { gap: spacing.lg },
  stars: { alignItems: 'center' as const, gap: spacing.sm },
  input: { minHeight: 120, textAlignVertical: 'top' as const },
}));

type ReviewFormProps = {
  initialStars?: number;
  initialText?: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: ReviewFormValues) => void;
};

export function ReviewForm({
  initialStars = 0,
  initialText = '',
  submitLabel,
  isSubmitting,
  onSubmit,
}: ReviewFormProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const [stars, setStars] = useState(initialStars);
  const [text, setText] = useState(initialText);
  const [errors, setErrors] = useState<{ stars?: string; text?: string }>({});

  const submit = () => {
    const parsed = reviewSchema.safeParse({ stars, text });
    if (!parsed.success) {
      const next: { stars?: string; text?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'stars' || field === 'text') next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <View style={styles.root}>
      <View style={styles.stars}>
        <StarRating value={stars} onChange={setStars} size={40} />
        {errors.stars ? (
          <AppText variant="caption" color="danger">
            {t(errors.stars)}
          </AppText>
        ) : null}
      </View>
      <TextField
        label={t('reviews.form.text')}
        placeholder={t('reviews.form.placeholder')}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={REVIEW_TEXT_MAX}
        error={errors.text ? t(errors.text) : null}
        helper={`${text.length}/${REVIEW_TEXT_MAX}`}
        style={styles.input}
      />
      <Button label={submitLabel} loading={isSubmitting} onPress={submit} />
    </View>
  );
}