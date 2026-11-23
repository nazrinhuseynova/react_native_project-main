import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { SEEK_STEP_SECONDS } from '@/core/config/constants';
import { formatDuration } from '@/core/utils/formatDuration';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';

import { SeekBar } from './SeekBar';

const useStyles = makeStyles(({ colors, spacing }) => ({
  root: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between' as const,
  },
  top: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  titleBox: { flex: 1, marginHorizontal: spacing.sm },
  center: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    columnGap: spacing.xxl,
  },
  bottom: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  times: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  actions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: spacing.xs,
  },
  actionGroup: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    columnGap: spacing.sm,
  },
}));

type PlayerControlsProps = {
  title: string;
  subtitle?: string;
  visible: boolean;
  isPlaying: boolean;
  positionSec: number;
  durationSec: number;
  bufferedSec: number;
  speedLabel: string;
  hasNext: boolean;
  onBack: () => void;
  onTogglePlay: () => void;
  onSeekBy: (deltaSec: number) => void;
  onSeek: (sec: number) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
  onOpenSpeed: () => void;
  onOpenTracks: () => void;
  onOpenQuality: () => void;
  onNext: () => void;
  cast: ReactNode;
  pip: ReactNode;
  lock: ReactNode;
};

export function PlayerControls(props: PlayerControlsProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  if (!props.visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} pointerEvents="box-none" style={styles.root}>
      <View style={styles.top} pointerEvents="box-none">
        <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={props.onBack} color="#FFFFFF" />
        <View style={styles.titleBox}>
          <AppText variant="headline" numberOfLines={1} color="#FFFFFF">
            {props.title}
          </AppText>
          {props.subtitle ? (
            <AppText variant="caption" numberOfLines={1} color="#D0D0D8">
              {props.subtitle}
            </AppText>
          ) : null}
        </View>
        {props.cast}
        {props.pip}
      </View>

      <View style={styles.center} pointerEvents="box-none">
        <IconButton
          icon="play-back"
          size={32}
          accessibilityLabel={t('player.rewind', { count: SEEK_STEP_SECONDS })}
          onPress={() => props.onSeekBy(-SEEK_STEP_SECONDS)}
          color="#FFFFFF"
        />
        <IconButton
          icon={props.isPlaying ? 'pause' : 'play'}
          size={44}
          accessibilityLabel={props.isPlaying ? t('player.pause') : t('player.play')}
          onPress={props.onTogglePlay}
          color="#FFFFFF"
        />
        <IconButton
          icon="play-forward"
          size={32}
          accessibilityLabel={t('player.forward', { count: SEEK_STEP_SECONDS })}
          onPress={() => props.onSeekBy(SEEK_STEP_SECONDS)}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.bottom} pointerEvents="box-none">
        <SeekBar
          positionSec={props.positionSec}
          durationSec={props.durationSec}
          bufferedSec={props.bufferedSec}
          onScrubStart={props.onScrubStart}
          onScrubEnd={props.onScrubEnd}
          onSeek={props.onSeek}
        />
        <View style={styles.times}>
          <AppText variant="caption" color="#FFFFFF">
            {formatDuration(props.positionSec)}
          </AppText>
          <AppText variant="caption" color="#FFFFFF">
            {formatDuration(props.durationSec)}
          </AppText>
        </View>
        <View style={styles.actions}>
          <View style={styles.actionGroup}>
            {props.lock}
            <IconButton icon="speedometer-outline" accessibilityLabel={t('player.speed')} onPress={props.onOpenSpeed} color="#FFFFFF" />
            <AppText variant="captionStrong" color="#FFFFFF">
              {props.speedLabel}
            </AppText>
          </View>
          <View style={styles.actionGroup}>
            <IconButton icon="chatbubble-ellipses-outline" accessibilityLabel={t('player.audioSubtitles')} onPress={props.onOpenTracks} color="#FFFFFF" />
            <IconButton icon="options-outline" accessibilityLabel={t('player.quality')} onPress={props.onOpenQuality} color="#FFFFFF" />
            {props.hasNext ? (
              <IconButton icon="play-skip-forward" accessibilityLabel={t('player.nextEpisode')} onPress={props.onNext} color="#FFFFFF" />
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}