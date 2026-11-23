import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';

import { isValidSegment, type SkipSegment, type SkipSegmentKind } from '../domain/entities/SkipSegment';
import type { SkipSegmentRepository } from '../domain/repositories/SkipSegmentRepository';

type SegmentRow = {
  id: string;
  title_id: string;
  episode_id: string | null;
  kind: string;
  start_sec: number;
  end_sec: number;
};

const COLUMNS = 'id,title_id,episode_id,kind,start_sec,end_sec';

function toSegment(row: SegmentRow): SkipSegment {
  return {
    id: row.id,
    titleId: row.title_id,
    episodeId: row.episode_id,
    kind: (row.kind === 'recap' ? 'recap' : 'intro') as SkipSegmentKind,
    startSec: Number(row.start_sec),
    endSec: Number(row.end_sec),
  };
}

export class SupabaseSkipSegmentRepository implements SkipSegmentRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async listFor(titleId: string, episodeId: string | null): Promise<SkipSegment[]> {
    let query = this.client.from('skip_segments').select(COLUMNS).eq('title_id', titleId);
    query = episodeId ? query.eq('episode_id', episodeId) : query.is('episode_id', null);

    const { data, error } = await query;
    if (error) {
      throw new AppError('Failed to load skip segments', {
        code: 'SKIP_SEGMENTS',
        userMessageKey: 'errors.unknown',
        cause: error,
      });
    }
    return ((data ?? []) as SegmentRow[]).map(toSegment).filter(isValidSegment);
  }
}