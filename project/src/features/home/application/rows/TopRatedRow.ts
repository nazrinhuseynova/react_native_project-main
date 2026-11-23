import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { loadPerKind, toEntries } from './rowUtils';

export class TopRatedRow implements HomeRow {
  readonly id = 'top-rated';
  readonly order = 80;
  readonly titleKey = 'home.rows.topRated';
  readonly variant = 'poster' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const titles = await loadPerKind(ctx, {
      movie: () => ctx.discover.topRated('movie'),
      tv: () => ctx.discover.topRated('tv'),
    });
    return { entries: toEntries(titles) };
  }
}