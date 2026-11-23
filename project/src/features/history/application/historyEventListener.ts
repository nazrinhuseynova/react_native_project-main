import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import type { Logger } from '@/core/logging/Logger';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';
import { PROGRESS_SAVE_INTERVAL_MS } from '@/core/config/constants';
import { isTitleId } from '@/features/catalog';
import { throttle } from '@/core/utils/throttle';

import type { SaveProgress } from '../domain/usecases/SaveProgress';

type ProgressPayload = AppEvents['playback.progress'];

export type HistoryListenerDeps = {
  events: EventBus<AppEvents>;
  storage: KeyValueStorage;
  save: SaveProgress;
  logger: Logger;
  onSaved?: () => void;
};

/** EventBus: playback.progress → SaveProgress (throttle). Dayandıranda/bitəndə dərhal yazır. */
export function startHistoryListener({
  events,
  storage,
  save,
  logger,
  onSaved,
}: HistoryListenerDeps): () => void {
  let profileId: string | null = null;
  let last: ProgressPayload | null = null;

  void storage.getString(storageKeys.activeProfileId).then((stored) => {
    profileId = profileId ?? stored;
  });

  const persist = (payload: ProgressPayload) => {
    if (!profileId || !isTitleId(payload.titleId)) return;
    save
      .execute(profileId, {
        titleId: payload.titleId,
        episodeId: payload.episodeId,
        positionSec: payload.positionSec,
        durationSec: payload.durationSec,
      })
      .then(() => onSaved?.())
      .catch((error: unknown) => logger.warn('history.save_failed', { error: String(error) }));
  };

  const throttled = throttle(persist, PROGRESS_SAVE_INTERVAL_MS);

  const offs = [
    events.on('profile.switched', ({ profileId: next }) => {
      profileId = next;
      void save.flush().catch(() => undefined);
    }),
    events.on('auth.signedOut', () => {
      profileId = null;
      last = null;
      throttled.cancel();
    }),
    events.on('playback.progress', (payload) => {
      last = payload;
      throttled(payload);
    }),
    events.on('playback.paused', ({ titleId, positionSec }) => {
      if (!last || last.titleId !== titleId) return;
      throttled.cancel();
      persist({ ...last, positionSec });
    }),
    events.on('playback.completed', ({ titleId, episodeId, durationSec }) => {
      throttled.cancel();
      persist({ titleId, episodeId, positionSec: durationSec, durationSec });
    }),
  ];

  return () => {
    offs.forEach((off) => off());
    throttled.cancel();
  };
}