import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { loadPerKind, toEntries } from './rowUtils';

export class PopularRow implements HomeRow {
  readonly id = 'popular';
  readonly order = 60;
  readonly titleKey = 'home.rows.popular';
  readonly variant = 'poster' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const titles = await loadPerKind(ctx, {
      movie: () => ctx.discover.popular('movie'),
      tv: () => ctx.discover.popular('tv'),
    });
    return { entries: toEntries(titles) };
  }
}