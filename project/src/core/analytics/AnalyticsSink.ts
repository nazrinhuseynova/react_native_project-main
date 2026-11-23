import type { AnalyticsEventName } from './analyticsEvents';

export type AnalyticsRecord = {
  name: AnalyticsEventName;
  properties: object;
  timestamp: number;
  sessionId: string;
  userId: string | null;
};

export interface AnalyticsSink {
  readonly name: string;
  send(record: AnalyticsRecord): Promise<void> | void;
  flush?(): Promise<void>;
}