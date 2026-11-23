import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { useTrailers, youTubeUrl, type Video } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';

const MAX_VIDEOS = 8;
const CARD_WIDTH = 220;

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  list: { gap: spacing.md },
  card: { width: CARD_WIDTH, gap: spacing.xs },
  thumb: {
    width: CARD_WIDTH,
    height: 124,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  },
}));

function TrailerCard({ video }: { video: Video }) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <ScalePressable
      {...buttonA11y(video.name)}
      onPress={() => void WebBrowser.openBrowserAsync(youTubeUrl(video))}
      style={styles.card}
    >
      <View style={styles.thumb}>
        <Image
          source={{ uri: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg` }}
          contentFit="cover"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
        <Ionicons name="play-circle" size={40} color={colors.text} />
      </View>
      <AppText variant="caption" numberOfLines={2}>
        {video.name}
      </AppText>
    </ScalePressable>
  );
}

export function TrailersSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { videos } = useTrailers(details.title.id);

  const youtube = videos.filter((video) => video.site === 'YouTube').slice(0, MAX_VIDEOS);
  if (youtube.length === 0) return null;

  return (
    <View>
      <SectionHeader title={t('details.trailers')} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={youtube}
        keyExtractor={(video) => video.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <TrailerCard video={item} />}
      />
    </View>
  );
}