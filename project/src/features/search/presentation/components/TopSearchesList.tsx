import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { Title, TitleId } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { SectionHeader } from '@/shared/ui/SectionHeader';

const useStyles = makeStyles(({ colors, radius, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  rank: { width: 24, textAlign: 'center' as const },
  poster: { width: 48, height: 72, borderRadius: radius.sm, backgroundColor: colors.skeleton },
  name: { flex: 1 },
}));

type TopSearchesListProps = {
  titles: readonly Title[];
  onPress: (id: TitleId) => void;
};

export function TopSearchesList({ titles, onPress }: TopSearchesListProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors } = useTheme();

  if (titles.length === 0) return null;

  return (
    <View>
      <SectionHeader title={t('search.top.title')} />
      {titles.map((title, index) => (
        <ScalePressable
          key={title.id}
          {...buttonA11y(title.name)}
          onPress={() => onPress(title.id)}
          style={styles.row}
        >
          <AppText variant="title3" color="textMuted" style={styles.rank}>
            {index + 1}
          </AppText>
          {title.poster ? (
            <Image source={{ uri: title.poster.small }} contentFit="cover" style={styles.poster} />
          ) : (
            <View style={styles.poster} />
          )}
          <AppText variant="bodyStrong" numberOfLines={2} style={styles.name}>
            {title.name}
          </AppText>
          <Ionicons name="play-circle-outline" size={26} color={colors.textSecondary} />
        </ScalePressable>
      ))}
    </View>
  );
}