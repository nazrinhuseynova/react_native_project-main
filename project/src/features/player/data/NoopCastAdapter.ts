import type { PlaybackSource } from '../domain/entities/PlaybackSource';
import type { CastPort, CastState } from '../domain/ports/CastPort';

/** Chromecast/AirPlay hələ yoxdur. Sonra: GoogleCastAdapter.ts */
export class NoopCastAdapter implements CastPort {
  getState(): CastState {
    return 'unavailable';
  }

  subscribe(_listener: (state: CastState) => void): () => void {
    return () => undefined;
  }

  async connect(): Promise<void> {
    return undefined;
  }

  async disconnect(): Promise<void> {
    return undefined;
  }

  async load(_source: PlaybackSource, _positionSec: number): Promise<void> {
    return undefined;
  }
}