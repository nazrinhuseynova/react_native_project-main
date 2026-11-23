import type { MediaKind } from '@/features/catalog';

import type { HomeContext } from '../../domain/HomeContext';
import type { HomeRow, HomeRowResult } from '../../domain/HomeRow';
import { interleave, toEntries } from './rowUtils';

const MAX_PREFERRED_ROWS = 6;
const PREFERRED_BASE_ORDER = 100;

export class GenreRow implements HomeRow {
  readonly id: string;
  readonly order: number;
  readonly titleKey: string;
  readonly variant = 'poster' as const;
  readonly audience = 'standard' as const;
  readonly categories = ['all', 'genre'] as const;
  private readonly genreId: number;
  private readonly kind: MediaKind | null;

  constructor(genreId: number, order: number, kind: MediaKind | null = null) {
    this.genreId = genreId;
    this.kind = kind;
    this.order = order;
    this.id = `genre-${kind ?? 'any'}-${genreId}`;
    this.titleKey =
      kind === 'movie' ? 'home.rows.genreMovies' : kind === 'tv' ? 'home.rows.genreSeries' : 'home.rows.genre';
  }

  async load(ctx: HomeContext): Promise<HomeRowResult> {
    const titles = this.kind
      ? (await ctx.discover.byGenre(this.kind, this.genreId)).items
      : await this.loadBoth(ctx);

    return {
      entries: toEntries(titles),
      titleParams: { genre: ctx.genreNames[this.genreId] ?? '' },
    };
  }

  private async loadBoth(ctx: HomeContext) {
    const [movies, shows] = await Promise.all([
      ctx.discover.byGenre('movie', this.genreId),
      ctx.discover.byGenre('tv', this.genreId),
    ]);
    return interleave(movies.items, shows.items);
  }
}

export const GenreRowFactory = {
 
  forPreferences(genreIds: readonly number[]): HomeRow[] {
    return genreIds
      .slice(0, MAX_PREFERRED_ROWS)
      .map((genreId, index) => new GenreRow(genreId, PREFERRED_BASE_ORDER + index));
  },
  forCategory(genreId: number): HomeRow[] {
    return [new GenreRow(genreId, 10, 'movie'), new GenreRow(genreId, 20, 'tv')];
  },
};