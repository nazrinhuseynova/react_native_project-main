import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useGenres } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';

import {
  DEFAULT_SEARCH_FILTER,
  RATING_STEPS,
  type SearchFilter,
  type SearchKind,
} from '../../domain/entities/SearchFilter';

const useStyles = makeStyles(({ spacing }) => ({
  body: { maxHeight: 460 },
  group: { marginBottom: spacing.lg, gap: spacing.sm },
  wrap: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  action: { flex: 1 },
}));

const KINDS: readonly SearchKind[] = ['all', 'movie', 'tv'];

type FilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  filter: SearchFilter;
  onApply: (filter: SearchFilter) => void;
};

export function FilterSheet({ visible, onClose, filter, onApply }: FilterSheetProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { genres } = useGenres('all');
  const [draft, setDraft] = useState(filter);

  useEffect(() => {
    if (visible) setDraft(filter);
  }, [visible, filter]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('search.filters.title')}>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.group}>
          <AppText variant="captionStrong" color="textSecondary">
            {t('search.filters.kind')}
          </AppText>
          <View style={styles.wrap}>
            {KINDS.map((kind) => (
              <Chip
                key={kind}
                label={t(`search.filters.kinds.${kind}`)}
                selected={draft.kind === kind}
                onPress={() => setDraft({ ...draft, kind })}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <AppText variant="captionStrong" color="textSecondary">
            {t('search.filters.rating')}
          </AppText>
          <View style={styles.wrap}>
            {RATING_STEPS.map((step) => (
              <Chip
                key={step}
                label={step === 0 ? t('search.filters.ratingAny') : `${step}+`}
                selected={draft.minRating === step}
                onPress={() => setDraft({ ...draft, minRating: step })}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <AppText variant="captionStrong" color="textSecondary">
            {t('search.filters.genre')}
          </AppText>
          <View style={styles.wrap}>
            <Chip
              label={t('search.filters.genreAll')}
              selected={draft.genreId === null}
              onPress={() => setDraft({ ...draft, genreId: null })}
            />
            {genres.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                selected={draft.genreId === genre.id}
                onPress={() => setDraft({ ...draft, genreId: genre.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          style={styles.action}
          variant="secondary"
          label={t('search.filters.reset')}
          onPress={() => setDraft(DEFAULT_SEARCH_FILTER)}
        />
        <Button
          style={styles.action}
          label={t('search.filters.apply')}
          onPress={() => {
            onApply(draft);
            onClose();
          }}
        />
      </View>
    </BottomSheet>
  );
}