import { mediaKindOf } from '../../domain/CategoryFilter';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { toEntries } from './rowUtils';

export class TrendingRow implements HomeRow {
  readonly id = 'trending';
  readonly order = 30;
  readonly titleKey = 'home.rows.trending';
  readonly variant = 'poster' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const page = await ctx.discover.trending(mediaKindOf(ctx.category) ?? 'all', 'week');
    return { entries: toEntries(page.items) };
  }
}