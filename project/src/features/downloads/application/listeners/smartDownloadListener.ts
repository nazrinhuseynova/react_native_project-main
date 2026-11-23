import type { AppEvents } from '@/core/events/AppEvents';
import type { EventBus } from '@/core/events/EventBus';
import type { Logger } from '@/core/logging/Logger';

export type PlaybackCompleted = AppEvents['playback.completed'];

export function registerSmartDownloadListener(
  events: EventBus<AppEvents>,
  handler: (event: PlaybackCompleted) => Promise<void>,
  logger: Logger,
): () => void {
  return events.on('playback.completed', (event) => {
    handler(event).catch((error: unknown) =>
      logger.warn('downloads.smart_failed', { error: String(error) }),
    );
  });
}