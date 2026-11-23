import type { AudioOption } from './AudioOption';
import type { SubtitleOption } from './SubtitleOption';

export type StreamFormat = 'hls' | 'mp4';

export type PlaybackSource = {
  uri: string;
  format: StreamFormat;
  isLocal: boolean;
  subtitles: SubtitleOption[];
  audioTracks: AudioOption[];
};

export function inferStreamFormat(uri: string): StreamFormat {
  return /\.m3u8(\?|$)/i.test(uri) ? 'hls' : 'mp4';
}