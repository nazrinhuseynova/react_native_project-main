import { Image } from 'expo-image';
import { View } from 'react-native';

import { formatRuntime } from '@/core/utils/formatDuration';
import type { Episode } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  row: { flexDirection: 'row' as const, gap: spacing.md, paddingVertical: spacing.sm },
  still: { width: 120, height: 68, borderRadius: radius.sm, backgroundColor: colors.skeleton },
  text: { flex: 1, gap: spacing.xs },
  head: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, gap: spacing.sm },
}));

type EpisodeRowProps = {
  episode: Episode;
  onPress: (episode: Episode) => void;
};

export function EpisodeRow({ episode, onPress }: EpisodeRowProps) {
  const styles = useStyles();
  const label = `${episode.episodeNumber}. ${episode.name}`;

  return (
    <ScalePressable {...buttonA11y(label)} onPress={() => onPress(episode)} style={styles.row}>
      {episode.still ? (
        <Image source={{ uri: episode.still.medium }} contentFit="cover" style={styles.still} />
      ) : (
        <View style={styles.still} />
      )}
      <View style={styles.text}>
        <View style={styles.head}>
          <AppText variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
            {label}
          </AppText>
          {episode.runtimeMinutes ? (
            <AppText variant="caption" color="textSecondary">
              {formatRuntime(episode.runtimeMinutes)}
            </AppText>
          ) : null}
        </View>
        {episode.overview ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={3}>
            {episode.overview}
          </AppText>
        ) : null}
      </View>
    </ScalePressable>
  );
}