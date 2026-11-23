import type { MediaKind } from '@/features/catalog';

import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { toEntries } from './rowUtils';

export class KidsRow implements HomeRow {
  readonly id: string;
  readonly order: number;
  readonly titleKey: string;
  readonly variant = 'poster' as const;
  readonly audience = 'kids' as const;
  readonly categories = ['all'] as const;
  private readonly kind: MediaKind;

  constructor(kind: MediaKind) {
    this.kind = kind;
    this.id = `kids-${kind}`;
    this.order = kind === 'movie' ? 30 : 31;
    this.titleKey = kind === 'movie' ? 'home.rows.kidsMovies' : 'home.rows.kidsSeries';
  }

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const page = await ctx.discover.kidsSafe(this.kind);
    return { entries: toEntries(page.items) };
  }
}