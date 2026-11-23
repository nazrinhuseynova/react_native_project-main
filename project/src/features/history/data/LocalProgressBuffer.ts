import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';
import type { TitleId } from '@/features/catalog';

import type { WatchProgress } from '../domain/entities/WatchProgress';

export type BufferedProgress = {
  profileId: string;
  progress: WatchProgress;
};

type BufferShape = Record<string, BufferedProgress>;

function keyOf(profileId: string, titleId: TitleId): string {
  return `${profileId}:${titleId}`;
}

/** Offline-da lokal yazır, internet gələndə SaveProgress.flush() göndərir. */
export class LocalProgressBuffer {
  private readonly storage: KeyValueStorage;
  private tail: Promise<unknown> = Promise.resolve();

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  private run<T>(task: () => Promise<T>): Promise<T> {
    const next = this.tail.then(task, task);
    this.tail = next.catch(() => undefined);
    return next;
  }

  private async read(): Promise<BufferShape> {
    const stored = await readJson<BufferShape>(this.storage, storageKeys.progressBuffer);
    return stored && typeof stored === 'object' ? stored : {};
  }

  put(profileId: string, progress: WatchProgress): Promise<void> {
    return this.run(async () => {
      const all = await this.read();
      all[keyOf(profileId, progress.titleId)] = { profileId, progress };
      await writeJson(this.storage, storageKeys.progressBuffer, all);
    });
  }

  discard(profileId: string, titleId: TitleId): Promise<void> {
    return this.deleteKeys([keyOf(profileId, titleId)]);
  }

  entries(): Promise<[string, BufferedProgress][]> {
    return this.run(async () => Object.entries(await this.read()));
  }

  deleteKeys(keys: readonly string[]): Promise<void> {
    if (keys.length === 0) return Promise.resolve();
    return this.run(async () => {
      const all = await this.read();
      keys.forEach((key) => delete all[key]);
      await writeJson(this.storage, storageKeys.progressBuffer, all);
    });
  }
}