import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import type { Title } from '@/features/catalog';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';

type HeroBannerProps = {
  title: Title;
  genreNames: readonly string[];
  isSaved: boolean;
  onPlay: () => void;
  onToggleSaved: () => void;
  onPressInfo: () => void;
};

export function HeroBanner({
  title,
  genreNames,
  isSaved,
  onPlay,
  onToggleSaved,
  onPressInfo,
}: HeroBannerProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const { width } = useWindowDimensions();
  const height = Math.min(Math.round(width * 1.25), 540);
  const artwork = title.poster ?? title.backdrop;

  return (
    <View style={{ width, height, backgroundColor: colors.skeleton }}>
      {artwork ? (
        <Image
          source={{ uri: artwork.large }}
          contentFit="cover"
          transition={250}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <LinearGradient
        colors={['transparent', colors.background]}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={{ position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: spacing.md }}>
        <AppText variant="display" align="center" numberOfLines={2} onPress={onPressInfo}>
          {title.name}
        </AppText>
        {genreNames.length > 0 ? (
          <AppText variant="callout" color="textSecondary" align="center">
            {genreNames.join(' • ')}
          </AppText>
        ) : null}
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Button
            label={t('home.hero.play')}
            leftIcon="play"
            onPress={onPlay}
            style={{ flex: 1 }}
          />
          <Button
            label={isSaved ? t('home.hero.inMyList') : t('home.hero.myList')}
            leftIcon={isSaved ? 'checkmark' : 'add'}
            variant="secondary"
            onPress={onToggleSaved}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}