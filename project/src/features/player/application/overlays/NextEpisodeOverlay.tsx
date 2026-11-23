import { useTranslation } from 'react-i18next';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

import { NextEpisodeResolver } from '../../domain/services/NextEpisodeResolver';
import type { OverlayContext, PlayerOverlay } from './PlayerOverlay';

const resolver = new NextEpisodeResolver();

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  button: {
    position: 'absolute' as const,
    right: spacing.xl,
    bottom: 110,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.text,
  },
}));

function NextEpisodeButton({ ctx }: { ctx: OverlayContext }) {
  const { t } = useTranslation();
  const styles = useStyles();
  const seconds = resolver.remaining(ctx.positionSec, ctx.durationSec);
  const label = t('player.nextEpisode');

  return (
    <ScalePressable {...buttonA11y(label)} haptic onPress={ctx.playNext} style={styles.button}>
      <AppText variant="bodyStrong" color="#0B0B0F">
        {`${label} · ${seconds}s`}
      </AppText>
    </ScalePressable>
  );
}

export const nextEpisodeOverlay: PlayerOverlay = {
  id: 'next-episode',
  order: 20,
  shouldShow: (ctx) =>
    ctx.nextEpisode !== null && resolver.shouldPrompt(ctx.positionSec, ctx.durationSec),
  Component: NextEpisodeButton,
};