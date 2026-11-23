import type { SupabaseClient } from '@supabase/supabase-js';

import { ANALYTICS_BATCH_SIZE, ANALYTICS_FLUSH_INTERVAL_MS } from '@/core/config/constants';

import type { AnalyticsRecord, AnalyticsSink } from '../AnalyticsSink';

export type SupabaseSinkOptions = {
  table?: string;
  batchSize?: number;
  flushIntervalMs?: number;
  maxBuffer?: number;
};

export class SupabaseSink implements AnalyticsSink {
  readonly name = 'supabase';
  private readonly client: SupabaseClient;
  private readonly table: string;
  private readonly batchSize: number;
  private readonly flushIntervalMs: number;
  private readonly maxBuffer: number;
  private buffer: AnalyticsRecord[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(client: SupabaseClient, options: SupabaseSinkOptions = {}) {
    this.client = client;
    this.table = options.table ?? 'analytics_events';
    this.batchSize = options.batchSize ?? ANALYTICS_BATCH_SIZE;
    this.flushIntervalMs = options.flushIntervalMs ?? ANALYTICS_FLUSH_INTERVAL_MS;
    this.maxBuffer = options.maxBuffer ?? 200;
  }

  send(record: AnalyticsRecord): void {
    this.buffer.push(record);

    if (this.buffer.length >= this.batchSize) {
      this.flushSafely();
      return;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => this.flushSafely(), this.flushIntervalMs);
    }
  }

  async flush(): Promise<void> {
    this.clearTimer();
    if (this.buffer.length === 0) return;

    const batch = this.buffer;
    this.buffer = [];

    const { error } = await this.client.from(this.table).insert(batch.map(toRow));

    if (error) {
      this.buffer = [...batch, ...this.buffer].slice(-this.maxBuffer);
      throw error;
    }
  }

  private flushSafely(): void {
    this.flush().catch(() => undefined);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

function toRow(record: AnalyticsRecord) {
  return {
    user_id: record.userId,
    session_id: record.sessionId,
    name: record.name,
    properties: record.properties,
    occurred_at: new Date(record.timestamp).toISOString(),
  };
}