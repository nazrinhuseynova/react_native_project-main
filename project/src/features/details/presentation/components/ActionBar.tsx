import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { Title } from '@/features/catalog';
import { FavoriteButton, SaveButton } from '@/features/library';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { useTheme } from '@/shared/theme/useTheme';
import type { IconName } from '@/shared/types/common';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';

const useStyles = makeStyles(({ spacing }) => ({
  root: { gap: spacing.md },
  actions: { flexDirection: 'row' as const, justifyContent: 'space-around' as const },
}));

type ActionItemProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
};

function ActionItem({ icon, label, active = false, onPress }: ActionItemProps) {
  const { colors, spacing } = useTheme();
  return (
    <ScalePressable
      {...buttonA11y(label, { selected: active })}
      onPress={onPress}
      haptic
      style={{ alignItems: 'center', minWidth: 64, paddingVertical: spacing.xs }}
    >
      <Ionicons name={icon} size={26} color={active ? colors.star : colors.text} />
      <AppText variant="caption" color={active ? 'star' : 'textSecondary'} style={{ marginTop: spacing.xs }}>
        {label}
      </AppText>
    </ScalePressable>
  );
}

type ActionBarProps = {
  title: Title;
  resume: boolean;
  myRating: number | null;
  onPlay: () => void;
  onDownload: () => void;
  onRate: () => void;
  onShare: () => void;
};

export function ActionBar({ title, resume, myRating, onPlay, onDownload, onRate, onShare }: ActionBarProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Button
        size="lg"
        leftIcon="play"
        label={resume ? t('details.resume') : t('details.play')}
        onPress={onPlay}
      />
      <View style={styles.actions}>
        <SaveButton titleId={title.id} showLabel />
        <FavoriteButton titleId={title.id} showLabel />
        <ActionItem
          icon={myRating ? 'star' : 'star-outline'}
          label={myRating ? t('details.rated', { stars: myRating }) : t('details.rate')}
          active={myRating !== null}
          onPress={onRate}
        />
        <ActionItem icon="download-outline" label={t('details.download')} onPress={onDownload} />
        <ActionItem icon="share-social-outline" label={t('details.share')} onPress={onShare} />
      </View>
    </View>
  );
}