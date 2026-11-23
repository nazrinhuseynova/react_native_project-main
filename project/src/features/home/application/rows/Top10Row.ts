import { mediaKindOf } from '../../domain/CategoryFilter';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { toEntries } from './rowUtils';

const TOP_COUNT = 10;

export class Top10Row implements HomeRow {
  readonly id = 'top10';
  readonly order = 40;
  readonly titleKey = 'home.rows.top10';
  readonly variant = 'top10' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const page = await ctx.discover.trending(mediaKindOf(ctx.category) ?? 'all', 'day');
    return { entries: toEntries(page.items, TOP_COUNT) };
  }
}