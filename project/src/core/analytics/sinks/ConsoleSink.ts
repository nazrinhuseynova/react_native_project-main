import type { Logger } from '@/core/logging/Logger';

import type { AnalyticsRecord, AnalyticsSink } from '../AnalyticsSink';

export class ConsoleSink implements AnalyticsSink {
  readonly name = 'console';
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  send(record: AnalyticsRecord): void {
    this.logger.info(`analytics.${record.name}`, { ...record.properties });
  }
}