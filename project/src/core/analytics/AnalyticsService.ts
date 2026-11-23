import type { Logger } from '@/core/logging/Logger';
import { createId } from '@/core/utils/createId';

import type { AnalyticsEventMap, AnalyticsEventName } from './analyticsEvents';
import type { AnalyticsRecord, AnalyticsSink } from './AnalyticsSink';

export class AnalyticsService {
  private readonly sinks: AnalyticsSink[];
  private readonly logger?: Logger;
  private readonly sessionId = createId();
  private userId: string | null = null;

  constructor(sinks: AnalyticsSink[], logger?: Logger) {
    this.sinks = sinks;
    this.logger = logger;
  }

  setUser(userId: string | null): void {
    this.userId = userId;
  }

  track<N extends AnalyticsEventName>(name: N, properties: AnalyticsEventMap[N]): void {
    const record: AnalyticsRecord = {
      name,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.sinks.forEach((sink) => {
      void this.deliver(sink, record);
    });
  }

  async flush(): Promise<void> {
    await Promise.all(
      this.sinks.map(async (sink) => {
        try {
          await sink.flush?.();
        } catch (error) {
          this.logSinkError(sink, error);
        }
      }),
    );
  }

  private async deliver(sink: AnalyticsSink, record: AnalyticsRecord): Promise<void> {
    try {
      await sink.send(record);
    } catch (error) {
      this.logSinkError(sink, error);
    }
  }

  private logSinkError(sink: AnalyticsSink, error: unknown): void {
    this.logger?.warn('analytics.sink_failed', {
      sink: sink.name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}