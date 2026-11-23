import { useTranslation } from 'react-i18next';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

import { SkipSegmentFinder } from '../../domain/services/SkipSegmentFinder';
import type { OverlayContext, PlayerOverlay } from './PlayerOverlay';

const finder = new SkipSegmentFinder();

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  button: {
    position: 'absolute' as const,
    right: spacing.xl,
    bottom: 110,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.overlay,
  },
}));

function SkipIntroButton({ ctx }: { ctx: OverlayContext }) {
  const { t } = useTranslation();
  const styles = useStyles();
  const segment = finder.find(ctx.segments, ctx.positionSec);
  if (!segment) return null;

  const label = segment.kind === 'recap' ? t('player.skipRecap') : t('player.skipIntro');

  return (
    <ScalePressable
      {...buttonA11y(label)}
      haptic
      onPress={() => ctx.seekTo(segment.endSec)}
      style={styles.button}
    >
      <AppText variant="bodyStrong">{label}</AppText>
    </ScalePressable>
  );
}

export const skipIntroOverlay: PlayerOverlay = {
  id: 'skip-intro',
  order: 10,
  shouldShow: (ctx) => finder.find(ctx.segments, ctx.positionSec) !== null,
  Component: SkipIntroButton,
};