import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { TitleId } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';

import type { WatchedItem } from '../../application/hooks/useWatchedTitles';
import { WatchedBadge } from './WatchedBadge';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  thumb: { width: 128, height: 72, borderRadius: radius.sm, backgroundColor: colors.skeleton },
  text: { flex: 1, gap: spacing.xs },
}));

type HistoryRowProps = {
  item: WatchedItem;
  onPress: (id: TitleId) => void;
  onRemove: (id: TitleId) => void;
};

export function HistoryRow({ item, onPress, onRemove }: HistoryRowProps) {
  const { t, i18n } = useTranslation();
  const styles = useStyles();
  const { title, progress } = item;
  const artwork = title.backdrop ?? title.poster;
  const date = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString(i18n.language)
    : '';

  return (
    <View style={styles.row}>
      <ScalePressable
        {...buttonA11y(title.name)}
        onPress={() => onPress(title.id)}
        style={{ flexDirection: 'row', flex: 1, gap: 12 }}
      >
        {artwork ? (
          <Image source={{ uri: artwork.medium }} contentFit="cover" style={styles.thumb} />
        ) : (
          <View style={styles.thumb} />
        )}
        <View style={styles.text}>
          <AppText variant="bodyStrong" numberOfLines={2}>
            {title.name}
          </AppText>
          {date ? (
            <AppText variant="caption" color="textSecondary">
              {t('history.watchedOn', { date })}
            </AppText>
          ) : null}
          <WatchedBadge />
        </View>
      </ScalePressable>
      <IconButton
        icon="close"
        size={20}
        accessibilityLabel={t('history.remove')}
        onPress={() => onRemove(title.id)}
      />
    </View>
  );
}