import type { PlaybackSource } from '../domain/entities/PlaybackSource';
import type { StreamRequest, StreamResolver } from '../domain/repositories/StreamResolver';


export type LocalFileLookup = (titleId: string, episodeId: string | null) => Promise<string | null>;

export class LocalStreamResolver implements StreamResolver {
  private readonly lookup: LocalFileLookup;
  private readonly fallback: StreamResolver;

  constructor(lookup: LocalFileLookup, fallback: StreamResolver) {
    this.lookup = lookup;
    this.fallback = fallback;
  }

  async resolve(request: StreamRequest): Promise<PlaybackSource> {
    const fileUri = await this.lookup(request.titleId, request.episodeId).catch(() => null);
    if (fileUri) {
      return { uri: fileUri, format: 'mp4', isLocal: true, subtitles: [], audioTracks: [] };
    }
    return this.fallback.resolve(request);
  }
}