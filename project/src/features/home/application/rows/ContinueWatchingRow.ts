import type { TitleId } from '@/features/catalog';

import type { HomeContext } from '../../domain/HomeContext';
import type { HomeEntry, HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { matchesCategory, settleTitles } from './rowUtils';

const MAX_ITEMS = 10;

export class ContinueWatchingRow implements HomeRow {
  readonly id = 'continue-watching';
  readonly order = 10;
  readonly titleKey = 'home.rows.continueWatching';
  readonly variant = 'continue' as const;
  readonly audience = 'all' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const items = (await ctx.sources.history.continueWatching(ctx.profile.id)).slice(0, MAX_ITEMS);
    if (items.length === 0) return { entries: [] };

    const progressById = new Map<TitleId, number>(items.map((item) => [item.titleId, item.progress]));
    const titles = await settleTitles(
      items.map((item) => item.titleId),
      (id) => ctx.titles.details(id as TitleId),
    );

    const entries: HomeEntry[] = titles
      .filter((title) => matchesCategory(title, ctx.category))
      .map((title) => ({ title, progress: progressById.get(title.id) ?? 0 }));
    return { entries };
  }
}