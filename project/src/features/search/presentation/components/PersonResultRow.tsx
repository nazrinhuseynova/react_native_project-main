import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

import type { PersonResult } from '../../domain/entities/SearchResult';

const AVATAR = 56;

const useStyles = makeStyles(({ colors, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.skeleton,
  },
  image: { width: AVATAR, height: AVATAR },
  text: { flex: 1 },
}));

type PersonResultRowProps = {
  person: PersonResult;
  onPress: (personId: number) => void;
};

export function PersonResultRow({ person, onPress }: PersonResultRowProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const knownFor = person.knownFor
    .slice(0, 3)
    .map((title) => title.name)
    .join(', ');
  const subtitle = [person.department, knownFor].filter(Boolean).join(' · ');

  return (
    <ScalePressable
      {...buttonA11y(subtitle ? `${person.name}, ${subtitle}` : person.name)}
      onPress={() => onPress(person.id)}
      style={styles.row}
    >
      <View style={styles.avatar}>
        {person.profile ? (
          <Image source={{ uri: person.profile.medium }} contentFit="cover" style={styles.image} />
        ) : (
          <Ionicons name="person" size={AVATAR / 2} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {person.name}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </ScalePressable>
  );
}