import { useCallback, useEffect, useRef } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { COMPLETE_THRESHOLD, PROGRESS_SAVE_INTERVAL_MS } from '@/core/config/constants';

type PlaybackEventsInput = {
  titleId: string;
  episodeId: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  ended: boolean;
  positionSec: number;
  durationSec: number;
};

export function usePlaybackEvents(input: PlaybackEventsInput) {
  const { eventBus } = useServices();
  const { titleId, isPlaying, isBuffering, ended } = input;
  const episodeId = input.episodeId ?? undefined;

  const latest = useRef(input);
  latest.current = input;

  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const wasBufferingRef = useRef(false);

  useEffect(() => {
    if (isPlaying && !startedRef.current) {
      startedRef.current = true;
      eventBus.emit('playback.started', { titleId, episodeId, positionSec: latest.current.positionSec });
    }
    if (!isPlaying && wasPlayingRef.current && !latest.current.ended) {
      eventBus.emit('playback.paused', { titleId, episodeId, positionSec: latest.current.positionSec });
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying, eventBus, titleId, episodeId]);

  useEffect(() => {
    if (isBuffering && !wasBufferingRef.current && startedRef.current) {
      eventBus.emit('playback.buffering', { titleId, positionSec: latest.current.positionSec });
    }
    wasBufferingRef.current = isBuffering;
  }, [isBuffering, eventBus, titleId]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(() => {
      const { positionSec, durationSec } = latest.current;
      if (durationSec > 0) {
        eventBus.emit('playback.progress', { titleId, episodeId, positionSec, durationSec });
      }
    }, PROGRESS_SAVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPlaying, eventBus, titleId, episodeId]);

  useEffect(() => {
    if (completedRef.current) return;
    const { positionSec, durationSec } = latest.current;
    const reachedThreshold = durationSec > 0 && positionSec / durationSec >= COMPLETE_THRESHOLD;
    if (ended || reachedThreshold) {
      completedRef.current = true;
      eventBus.emit('playback.completed', { titleId, episodeId, durationSec });
    }
  }, [ended, input.positionSec, eventBus, titleId, episodeId]);

  
  useEffect(
    () => () => {
      const { positionSec, durationSec } = latest.current;
      if (startedRef.current && durationSec > 0) {
        eventBus.emit('playback.progress', { titleId, episodeId, positionSec, durationSec });
      }
    },
    [eventBus, titleId, episodeId],
  );

  const notifySeek = useCallback(
    (fromSec: number, toSec: number) => {
      eventBus.emit('playback.seeked', { titleId, fromSec, toSec });
    },
    [eventBus, titleId],
  );

  return { notifySeek };
}