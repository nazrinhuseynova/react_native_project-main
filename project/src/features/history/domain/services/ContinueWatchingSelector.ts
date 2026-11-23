import type { WatchProgress } from '../entities/WatchProgress';
import type { CompletionPolicy } from '../policies/CompletionPolicy';

export const MIN_RESUME_SECONDS = 30;
export const CONTINUE_WATCHING_LIMIT = 20;

export class ContinueWatchingSelector {
  private readonly policy: CompletionPolicy;

  constructor(policy: CompletionPolicy) {
    this.policy = policy;
  }

  select(items: readonly WatchProgress[], limit: number = CONTINUE_WATCHING_LIMIT): WatchProgress[] {
    return items
      .filter(
        (item) =>
          item.positionSec >= MIN_RESUME_SECONDS &&
          !this.policy.isCompleted(item.positionSec, item.durationSec),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  }
}