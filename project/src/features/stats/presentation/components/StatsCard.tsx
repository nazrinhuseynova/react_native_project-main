import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Skeleton } from '@/shared/ui/Skeleton';

import { useWatchStats } from '../../application/hooks/useWatchStats';
import { GenreBarChart } from './GenreBarChart';
import { StatTile } from './StatTile';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.lg },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
}));

export function StatsCard() {
  const { t } = useTranslation();
  const styles: Record<string, any> = useStyles();
  const { stats, isLoading } = useWatchStats();

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Skeleton height={20} width="40%" />
        <Skeleton height={140} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <AppText variant="title3">{t('stats.title')}</AppText>

      {stats.totalTitles === 0 ? (
        <AppText variant="callout" color="textSecondary">
          {t('stats.empty')}
        </AppText>
      ) : (
        <>
          <View style={styles.tiles}>
            <StatTile icon="film-outline" value={String(stats.totalTitles)} label={t('stats.totalTitles')} />
            <StatTile icon="time-outline" value={t('stats.hoursValue', { value: stats.totalHours })} label={t('stats.totalHours')} />
            <StatTile icon="pricetag-outline" value={stats.topGenre?.name ?? '–'} label={t('stats.topGenre')} />
            <StatTile
              icon="star-outline"
              value={stats.averageRating !== null ? stats.averageRating.toFixed(1) : '–'}
              label={t('stats.avgRating')}
            />
          </View>
          {stats.genres.length > 0 ? (
            <View>
              <AppText variant="captionStrong" color="textSecondary" style={{ marginBottom: 8 }}>
                {t('stats.genres')}
              </AppText>
              <GenreBarChart data={stats.genres} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}