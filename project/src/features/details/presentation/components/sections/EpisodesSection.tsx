import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { isSeries, toRouteParams, useSeason, type Episode } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { Skeleton } from '@/shared/ui/Skeleton';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';
import { EpisodeRow } from '../EpisodeRow';
import { SeasonSelector } from '../SeasonSelector';

const useStyles = makeStyles(({ spacing }) => ({
  list: { marginTop: spacing.md },
}));

export function EpisodesSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { title } = details;

  const seasons = isSeries(title) ? title.seasons.filter((season) => season.seasonNumber > 0) : [];
  const [selected, setSelected] = useState<number | null>(seasons[0]?.seasonNumber ?? null);
  const { season, isLoading } = useSeason(title.id, selected);

  if (seasons.length === 0) return null;

  const play = (episode: Episode) =>
    router.push({
      pathname: '/player/[id]',
      params: {
        ...toRouteParams(title.id),
        season: String(episode.seasonNumber),
        episode: String(episode.episodeNumber),
      },
    });

  return (
    <View>
      <SectionHeader title={t('details.episodes')} />
      <SeasonSelector seasons={seasons} value={selected} onChange={setSelected} />
      <View style={styles.list}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} height={68} radius={8} style={{ marginBottom: 12 }} />
            ))
          : season?.episodes.map((episode) => (
              <EpisodeRow key={episode.id} episode={episode} onPress={play} />
            ))}
      </View>
    </View>
  );
}