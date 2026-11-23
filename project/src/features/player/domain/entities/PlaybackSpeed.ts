export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5] as const;

export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export const DEFAULT_SPEED: PlaybackSpeed = 1;

export function isPlaybackSpeed(value: number): value is PlaybackSpeed {
  return (PLAYBACK_SPEEDS as readonly number[]).includes(value);
}

export function formatSpeed(speed: number): string {
  return `${speed}x`;
}