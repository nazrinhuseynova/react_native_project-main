import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { loadPerKind, toEntries } from './rowUtils';

export class NewReleasesRow implements HomeRow {
  readonly id = 'new-releases';
  readonly order = 70;
  readonly titleKey = 'home.rows.newReleases';
  readonly variant = 'backdrop' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const titles = await loadPerKind(ctx, {
      movie: () => ctx.discover.nowPlaying(),
      tv: () => ctx.discover.onTheAir(),
    });
    return { entries: toEntries(titles) };
  }
}