import { useMemo, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';

import { clamp } from '@/core/utils/clamp';
import { makeStyles } from '@/shared/theme/makeStyles';

import { SEEK_STEP_SECONDS } from '@/core/config/constants';
import { SeekCalculator } from '../../domain/services/SeekCalculator';

const calculator = new SeekCalculator();

const useStyles = makeStyles(({ colors }) => ({
  hit: { height: 36, justifyContent: 'center' as const },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden' as const,
  },
  buffered: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  played: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute' as const,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    top: 11,
    backgroundColor: colors.primary,
  },
}));

type SeekBarProps = {
  positionSec: number;
  durationSec: number;
  bufferedSec: number;
  onScrubStart: () => void;
  onScrubEnd: () => void;
  onSeek: (sec: number) => void;
};

function toFraction(x: number, width: number): number {
  return width > 0 ? clamp(x / width, 0, 1) : 0;
}

export function SeekBar({
  positionSec,
  durationSec,
  bufferedSec,
  onScrubStart,
  onScrubEnd,
  onSeek,
}: SeekBarProps) {
  const styles = useStyles();
  const [dragFraction, setDragFraction] = useState<number | null>(null);
  const widthRef = useRef(0);
  const startXRef = useRef(0);
  const durationRef = useRef(durationSec);
  durationRef.current = durationSec;
  const callbacks = useRef({ onScrubStart, onScrubEnd, onSeek });
  callbacks.current = { onScrubStart, onScrubEnd, onSeek };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          startXRef.current = event.nativeEvent.locationX;
          setDragFraction(toFraction(startXRef.current, widthRef.current));
          callbacks.current.onScrubStart();
        },
        onPanResponderMove: (_, gesture) => {
          setDragFraction(toFraction(startXRef.current + gesture.dx, widthRef.current));
        },
        onPanResponderRelease: (_, gesture) => {
          const fraction = toFraction(startXRef.current + gesture.dx, widthRef.current);
          setDragFraction(null);
          callbacks.current.onSeek(calculator.fractionToSeconds(fraction, durationRef.current));
          callbacks.current.onScrubEnd();
        },
        onPanResponderTerminate: () => {
          setDragFraction(null);
          callbacks.current.onScrubEnd();
        },
      }),
    [],
  );

  const playedFraction = dragFraction ?? calculator.secondsToFraction(positionSec, durationSec);
  const bufferedFraction = calculator.secondsToFraction(bufferedSec, durationSec);

  return (
    <View
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Seek"
      accessibilityValue={{ min: 0, max: Math.round(durationSec), now: Math.round(positionSec) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        const delta = event.nativeEvent.actionName === 'increment' ? SEEK_STEP_SECONDS : -SEEK_STEP_SECONDS;
        onSeek(calculator.seekBy(positionSec, delta, durationSec));
      }}
      onLayout={(event) => {
        widthRef.current = event.nativeEvent.layout.width;
      }}
      style={styles.hit}
    >
      <View style={styles.track}>
        <View style={[styles.buffered, { width: `${bufferedFraction * 100}%` }]} />
        <View style={[styles.played, { width: `${playedFraction * 100}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${playedFraction * 100}%` }]} />
    </View>
  );
}