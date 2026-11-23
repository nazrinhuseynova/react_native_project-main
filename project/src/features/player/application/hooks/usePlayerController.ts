import { useVideoPlayer, type VideoPlayer, type VideoSource } from 'expo-video';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clamp } from '@/core/utils/clamp';

import type { PlaybackSource } from '../../domain/entities/PlaybackSource';
import { SeekCalculator } from '../../domain/services/SeekCalculator';

const calculator = new SeekCalculator();

export type PlayerController = {
  player: VideoPlayer;
  isPlaying: boolean;
  isBuffering: boolean;
  ended: boolean;
  positionSec: number;
  durationSec: number;
  bufferedSec: number;
  errorMessage: string | null;
  positionRef: React.RefObject<number>;
  play(): void;
  pause(): void;
  toggle(): void;
  seekTo(sec: number): void;
  seekBy(deltaSec: number): void;
  getVolume(): number;
  setVolume(value: number): void;
};

/**
 * NOTE: expo-video API-si (useVideoPlayer, addListener hadisələri: playingChange,
 * statusChange, timeUpdate, playToEnd) SDK 58 docs ilə yoxlanmalıdır.
 */
export function usePlayerController(source: PlaybackSource, startPositionSec: number): PlayerController {
  const videoSource = useMemo<VideoSource>(
    () => ({ uri: source.uri, contentType: source.format === 'hls' ? 'hls' : 'progressive' }),
    [source.uri, source.format],
  );

  const player = useVideoPlayer(videoSource, (instance) => {
    instance.timeUpdateEventInterval = 0.5;
    instance.staysActiveInBackground = true;
    instance.play();
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [ended, setEnded] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [bufferedSec, setBufferedSec] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const seededRef = useRef(false);

  useEffect(() => {
    const subscriptions = [
      player.addListener('playingChange', ({ isPlaying: playing }) => {
        setIsPlaying(playing);
        if (playing) setEnded(false);
      }),
      player.addListener('statusChange', ({ status, error }) => {
        setIsBuffering(status === 'loading');
        if (status === 'readyToPlay') {
          durationRef.current = player.duration;
          setDurationSec(player.duration);
          if (!seededRef.current) {
            seededRef.current = true;
            if (startPositionSec > 0) player.currentTime = startPositionSec;
          }
        }
        if (status === 'error') setErrorMessage(error?.message ?? 'playback_error');
      }),
      player.addListener('timeUpdate', ({ currentTime, bufferedPosition }) => {
        positionRef.current = currentTime;
        setPositionSec(currentTime);
        setBufferedSec(bufferedPosition);
        if (player.duration > 0 && player.duration !== durationRef.current) {
          durationRef.current = player.duration;
          setDurationSec(player.duration);
        }
      }),
      player.addListener('playToEnd', () => setEnded(true)),
    ];

    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [player, startPositionSec]);

  const play = useCallback(() => player.play(), [player]);
  const pause = useCallback(() => player.pause(), [player]);
  const toggle = useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  const seekTo = useCallback(
    (sec: number) => {
      const target = calculator.clampTo(sec, durationRef.current);
      player.currentTime = target;
      positionRef.current = target;
      setPositionSec(target);
    },
    [player],
  );

  const seekBy = useCallback(
    (deltaSec: number) => {
      seekTo(calculator.seekBy(positionRef.current, deltaSec, durationRef.current));
    },
    [seekTo],
  );

  const getVolume = useCallback(() => player.volume, [player]);
  const setVolume = useCallback(
    (value: number) => {
      player.volume = clamp(value, 0, 1);
    },
    [player],
  );

  return {
    player,
    isPlaying,
    isBuffering,
    ended,
    positionSec,
    durationSec,
    bufferedSec,
    errorMessage,
    positionRef,
    play,
    pause,
    toggle,
    seekTo,
    seekBy,
    getVolume,
    setVolume,
  };
}