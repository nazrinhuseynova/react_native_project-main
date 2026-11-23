import type { TitleId } from '@/features/catalog';

import type { LocalProgressBuffer } from '../../data/LocalProgressBuffer';
import type { WatchProgress } from '../entities/WatchProgress';
import type { CompletionPolicy } from '../policies/CompletionPolicy';
import type { HistoryRepository } from '../repositories/HistoryRepository';

export type SaveProgressInput = {
  titleId: TitleId;
  episodeId?: string;
  positionSec: number;
  durationSec: number;
};

function buildProgress(input: SaveProgressInput, policy: CompletionPolicy): WatchProgress {
  const durationSec = Math.max(0, Math.round(input.durationSec));
  const positionSec = Math.min(Math.max(0, Math.round(input.positionSec)), durationSec);
  const now = new Date().toISOString();

  return {
    titleId: input.titleId,
    episodeId: input.episodeId ?? null,
    positionSec,
    durationSec,
    completedAt: policy.isCompleted(positionSec, durationSec) ? now : null,
    updatedAt: now,
  };
}

export class SaveProgress {
  private readonly repository: HistoryRepository;
  private readonly policy: CompletionPolicy;
  private readonly buffer: LocalProgressBuffer;

  constructor(repository: HistoryRepository, policy: CompletionPolicy, buffer: LocalProgressBuffer) {
    this.repository = repository;
    this.policy = policy;
    this.buffer = buffer;
  }

  async execute(profileId: string, input: SaveProgressInput): Promise<WatchProgress> {
    const progress = buildProgress(input, this.policy);
    if (progress.durationSec === 0) return progress;

    try {
      await this.repository.save(profileId, progress);
    } catch {
      await this.buffer.put(profileId, progress);
      return progress;
    }

    await this.buffer.discard(profileId, progress.titleId);
    await this.flush();
    return progress;
  }

  /** Offline-da yığılanları göndərir; ilk xətada dayanır (hələ də offline ola bilər). */
  async flush(): Promise<void> {
    const pending = await this.buffer.entries();
    const sent: string[] = [];

    for (const [key, { profileId, progress }] of pending) {
      try {
        await this.repository.save(profileId, progress);
        sent.push(key);
      } catch {
        break;
      }
    }
    await this.buffer.deleteKeys(sent);
  }
}