import type { PlaybackSource } from '../entities/PlaybackSource';

export type CastState = 'unavailable' | 'disconnected' | 'connecting' | 'connected';

export interface CastPort {
  getState(): CastState;
  subscribe(listener: (state: CastState) => void): () => void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  load(source: PlaybackSource, positionSec: number): Promise<void>;
}