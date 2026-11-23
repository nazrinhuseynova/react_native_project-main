import { inferStreamFormat, type PlaybackSource } from '../domain/entities/PlaybackSource';
import type { StreamRequest, StreamResolver } from '../domain/repositories/StreamResolver';

const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export class DemoStreamResolver implements StreamResolver {
  async resolve(_request: StreamRequest): Promise<PlaybackSource> {
    return {
      uri: DEMO_HLS,
      format: inferStreamFormat(DEMO_HLS),
      isLocal: false,
      subtitles: [],
      audioTracks: [],
    };
  }
}