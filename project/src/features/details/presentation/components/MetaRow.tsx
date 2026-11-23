import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { formatRuntime } from '@/core/utils/formatDuration';
import { isMovie, releaseYear, type Title } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';

import type { QualityBadge } from '../../domain/services/QualityBadges';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  outline: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
}));

type MetaRowProps = {
  title: Title;
  matchScore: number | null;
  badges: readonly QualityBadge[];
};

export function MetaRow({ title, matchScore, badges }: MetaRowProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  const length = isMovie(title)
    ? title.runtimeMinutes
      ? formatRuntime(title.runtimeMinutes)
      : null
    : title.numberOfSeasons
      ? t('details.seasonsCount', { count: title.numberOfSeasons })
      : null;

  return (
    <View style={styles.row}>
      {matchScore !== null ? (
        <AppText variant="bodyStrong" color="success">
          {t('details.match', { score: matchScore })}
        </AppText>
      ) : null}
      {releaseYear(title) ? <AppText variant="callout" color="textSecondary">{releaseYear(title)}</AppText> : null}
      {title.certification ? (
        <View style={styles.outline}>
          <AppText variant="caption" color="textSecondary">
            {title.certification}
          </AppText>
        </View>
      ) : null}
      {length ? <AppText variant="callout" color="textSecondary">{length}</AppText> : null}
      {badges.map((badge) => (
        <Badge key={badge} label={badge} />
      ))}
    </View>
  );
}