import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import type { IconName } from '@/shared/types/common';
import { IconButton } from '@/shared/ui/IconButton';

import { REACTIONS, type Reaction } from '../../domain/entities/Reaction';

const useStyles = makeStyles(({ spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
  },
}));

const ICONS: Record<Reaction, { on: IconName; off: IconName }> = {
  dislike: { on: 'thumbs-down', off: 'thumbs-down-outline' },
  like: { on: 'thumbs-up', off: 'thumbs-up-outline' },
  love: { on: 'heart', off: 'heart-outline' },
};

type ReactionButtonsProps = {
  value: Reaction | null;
  onSelect: (reaction: Reaction) => void;
  disabled?: boolean;
};

export function ReactionButtons({ value, onSelect, disabled = false }: ReactionButtonsProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {REACTIONS.map((reaction) => {
        const selected = value === reaction;
        return (
          <IconButton
            key={reaction}
            filled
            icon={selected ? ICONS[reaction].on : ICONS[reaction].off}
            color={selected ? colors.primary : colors.text}
            selected={selected}
            disabled={disabled}
            accessibilityLabel={t(`reviews.reaction.${reaction}`)}
            onPress={() => onSelect(reaction)}
          />
        );
      })}
    </View>
  );
}