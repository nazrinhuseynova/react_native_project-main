import type { TitleId } from '@/features/catalog';

import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { matchesCategory, settleTitles, toEntries } from './rowUtils';

const MAX_ITEMS = 20;

export class MyListRow implements HomeRow {
  readonly id = 'my-list';
  readonly order = 20;
  readonly titleKey = 'home.rows.myList';
  readonly variant = 'poster' as const;
  readonly audience = 'all' as const;
  readonly categories = ['all', 'movie', 'tv'] as const;

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const ids = (await ctx.sources.library.savedTitleIds(ctx.profile.id)).slice(0, MAX_ITEMS);
    if (ids.length === 0) return { entries: [] };

    const titles = await settleTitles(ids, (id) => ctx.titles.details(id as TitleId));
    return { entries: toEntries(titles.filter((title) => matchesCategory(title, ctx.category))) };
  }
}