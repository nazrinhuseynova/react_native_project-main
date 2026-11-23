import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useWatchStats } from '../../application/hooks/useWatchStats';
import { GenreBarChart } from './GenreBarChart';
import { StatsCard } from './StatsCard';
import { StatTile } from './StatTile';

export function StatsOverview() {
  const { t } = useTranslation();
  const { stats, isLoading } = useWatchStats();

  if (isLoading || !stats) return null;

  return (
    <View style={{ gap: 16 }}>
      <StatsCard />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatTile
          icon="film-outline"
          label={t('stats.totalTitles')}
          value={String(stats.totalTitles)}
        />
        <StatTile
          icon="time-outline"
          label={t('stats.totalHours')}
          value={String(stats.totalHours)}
        />
      </View>
      <GenreBarChart data={stats.genres} />
    </View>
  );
}