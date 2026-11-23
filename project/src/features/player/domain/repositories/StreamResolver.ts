import type { PlaybackSource } from '../entities/PlaybackSource';

export type StreamRequest = {
  titleId: string;
  episodeId: string | null;
};

export interface StreamResolver {
  resolve(request: StreamRequest): Promise<PlaybackSource>;
}