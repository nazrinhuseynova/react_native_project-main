import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { matchesCategory, toEntries } from './rowUtils';

export class BecauseYouWatchedRow implements HomeRow {
  readonly id = 'because-you-watched';
  readonly order = 50;
  readonly titleKey = 'home.rows.becauseYouWatched';
  readonly variant = 'poster' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const [lastWatched] = await ctx.sources.history.recentlyWatched(ctx.profile.id);
    if (!lastWatched) return { entries: [] };

    const [base, recommendations] = await Promise.all([
      ctx.titles.details(lastWatched),
      ctx.titles.recommendations(lastWatched),
    ]);

    const titles = recommendations.items.filter((title) => matchesCategory(title, ctx.category));
    return { entries: toEntries(titles), titleParams: { title: base.name } };
  }
}