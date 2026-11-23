import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { formatDate } from '@/core/utils/formatDate';
import {
  toRouteParams,
  useGenres,
  useTrailers,
  youTubeUrl,
  type Title,
  type TitleId,
} from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/ToastProvider';

import { useReminder } from '../../application/hooks/useReminder';

const useStyles = makeStyles(({ spacing, radius, colors }) => ({
  card: { gap: spacing.md, marginBottom: spacing.xl },
  media: {
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    overflow: 'hidden' as const,
    backgroundColor: colors.skeleton,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rank: { position: 'absolute' as const, left: spacing.md, top: spacing.sm },
  body: { gap: spacing.xs, paddingHorizontal: spacing.xs },
  actions: { flexDirection: 'row' as const, gap: spacing.sm, marginTop: spacing.sm },
}));

type UpcomingCardProps = {
  title: Title;
  rank?: number;
  /** true: "Coming Soon" kartı (Remind Me). false: artıq çıxıb (Play). */
  showReminder?: boolean;
  onPress: (id: TitleId) => void;
};

export function UpcomingCard({ title, rank, showReminder = false, onPress }: UpcomingCardProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { colors } = useTheme();
  const { names } = useGenres();
  const [trailerRequested, setTrailerRequested] = useState(false);

  const { trailer, isLoading: isTrailerLoading } = useTrailers(title.id, { enabled: trailerRequested });
  const reminder = useReminder({
    titleId: title.id,
    titleName: title.name,
    posterUrl: title.poster?.medium ?? null,
    releaseDate: title.releaseDate,
  });

  useEffect(() => {
    if (!trailerRequested || isTrailerLoading) return;
    setTrailerRequested(false);
    if (trailer) void WebBrowser.openBrowserAsync(youTubeUrl(trailer));
    else toast.info(t('newhot.noTrailer'));
  }, [trailerRequested, isTrailerLoading, trailer, toast, t]);

  const artwork = title.backdrop ?? title.poster;
  const genres = title.genreIds
    .slice(0, 3)
    .map((id) => names[id])
    .filter(Boolean)
    .join(' • ');

  return (
    <View style={styles.card}>
      <ScalePressable
        {...buttonA11y(`${t('newhot.trailer')}: ${title.name}`)}
        onPress={() => setTrailerRequested(true)}
        style={styles.media}
      >
        {artwork ? (
          <Image
            source={{ uri: artwork.medium }}
            contentFit="cover"
            transition={150}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={styles.playCircle}>
          <Ionicons name="play" size={28} color="#FFFFFF" />
        </View>
        {rank ? (
          <AppText variant="display" color="#FFFFFF" style={styles.rank}>
            {rank}
          </AppText>
        ) : null}
      </ScalePressable>

      <View style={styles.body}>
        {showReminder && title.releaseDate ? (
          <AppText variant="captionStrong" color="primary" uppercase>
            {t('newhot.releases', { date: formatDate(title.releaseDate, i18n.language, 'long') })}
          </AppText>
        ) : null}
        <AppText variant="title3" numberOfLines={2}>
          {title.name}
        </AppText>
        {genres ? (
          <AppText variant="caption" color="textSecondary">
            {genres}
          </AppText>
        ) : null}
        {title.overview ? (
          <AppText variant="callout" color="textSecondary" numberOfLines={3}>
            {title.overview}
          </AppText>
        ) : null}

        <View style={styles.actions}>
          {showReminder ? (
            <Button
              label={reminder.isReminded ? t('newhot.reminding') : t('newhot.remindMe')}
              leftIcon={reminder.isReminded ? 'notifications' : 'notifications-outline'}
              variant={reminder.isReminded ? 'secondary' : 'primary'}
              size="sm"
              fullWidth={false}
              loading={reminder.isPending}
              disabled={!reminder.canRemind && !reminder.isReminded}
              onPress={reminder.toggle}
            />
          ) : (
            <Button
              label={t('newhot.play')}
              leftIcon="play"
              size="sm"
              fullWidth={false}
              onPress={() => router.push({ pathname: '/player/[id]', params: toRouteParams(title.id) })}
            />
          )}
          <Button
            label={t('newhot.info')}
            leftIcon="information-circle-outline"
            variant="ghost"
            size="sm"
            fullWidth={false}
            onPress={() => onPress(title.id)}
          />
        </View>
      </View>
    </View>
  );
}