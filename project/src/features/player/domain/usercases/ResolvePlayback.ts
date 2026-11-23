import { AppError } from '@/core/errors/AppError';

import type { PlaybackSource } from '../entities/PlaybackSource';
import type { EntitlementGate, EntitlementSource } from '../ports/EntitlementGate';
import type { StreamRequest, StreamResolver } from '../repositories/StreamResolver';

export interface ResumePositionReader {
  get(titleId: string, episodeId: string | null): Promise<number>;
}

export type PlaybackSession = {
  source: PlaybackSource;
  startPositionSec: number;
  entitlement: EntitlementSource;
};

const MIN_RESUME_SEC = 5;

export class ResolvePlayback {
  private readonly gate: EntitlementGate;
  private readonly resolver: StreamResolver;
  private readonly resume: ResumePositionReader;

  constructor(gate: EntitlementGate, resolver: StreamResolver, resume: ResumePositionReader) {
    this.gate = gate;
    this.resolver = resolver;
    this.resume = resume;
  }

  async execute(request: StreamRequest): Promise<PlaybackSession> {
    const decision = await this.gate.check(request);
    if (!decision.allowed) {
      throw new AppError('Playback is not allowed', {
        code: 'NOT_ENTITLED',
        userMessageKey: 'player.errors.notEntitled',
        details: { reason: decision.reason },
      });
    }

    const source = await this.resolver.resolve(request);
    const saved = await this.resume.get(request.titleId, request.episodeId).catch(() => 0);

    return {
      source,
      startPositionSec: saved >= MIN_RESUME_SEC ? saved : 0,
      entitlement: decision.source,
    };
  }
}