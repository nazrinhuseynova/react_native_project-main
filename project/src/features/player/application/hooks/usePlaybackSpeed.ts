import type { VideoPlayer } from 'expo-video';
import { useCallback, useState } from 'react';

import { DEFAULT_SPEED, type PlaybackSpeed } from '../../domain/entities/PlaybackSpeed';

export function usePlaybackSpeed(player: VideoPlayer) {
  const [speed, setSpeedState] = useState<PlaybackSpeed>(DEFAULT_SPEED);

  const setSpeed = useCallback(
    (next: PlaybackSpeed) => {
      player.preservesPitch = true;
      player.playbackRate = next;
      setSpeedState(next);
    },
    [player],
  );

  return { speed, setSpeed };
}