export { PlayerScreen } from './presentation/screens/PlayerScreen';
export { TrailerPlayer } from './presentation/components/TrailerPlayer';

export type { PlaybackSource, StreamFormat } from './domain/entities/PlaybackSource';
export type { SkipSegment } from './domain/entities/SkipSegment';
export { toEpisodeId, parseEpisodeId } from './domain/services/NextEpisodeResolver';
export type { EpisodeRef } from './domain/services/NextEpisodeResolver';
export type { CastPort, CastState } from './domain/ports/CastPort';
export type {
  DenyReason,
  EntitlementDecision,
  EntitlementGate,
  EntitlementRequest,
  EntitlementSource,
} from './domain/ports/EntitlementGate';
export type { StreamRequest, StreamResolver } from './domain/repositories/StreamResolver';
export type { SkipSegmentRepository } from './domain/repositories/SkipSegmentRepository';

// ── container.ts üçün ──
export { ResolvePlayback } from './domain/usercases/ResolvePlayback';
export type { PlaybackSession, ResumePositionReader } from './domain/usercases/ResolvePlayback';
export { DemoStreamResolver } from './data/DemoStreamResolver';
export { LocalStreamResolver } from './data/LocalStreamResolver';
export type { LocalFileLookup } from './data/LocalStreamResolver';
export { NoopCastAdapter } from './data/NoopCastAdapter';
export { SupabaseSkipSegmentRepository } from './data/SupabaseSkipSegmentRepository';