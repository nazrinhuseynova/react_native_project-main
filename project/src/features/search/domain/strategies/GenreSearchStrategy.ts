import type { DiscoverRepository, GenreRepository, MediaKind } from '@/features/catalog';

import type { SearchPartial } from '../entities/SearchResult';
import { EMPTY_SEARCH_RESULTS } from '../entities/SearchResult';
import { foldText, matchesName } from '../services/normalizeQuery';
import type { SearchRequest, SearchStrategy } from './SearchStrategy';
export class GenreSearchStrategy implements SearchStrategy {
  readonly id = 'genre';
  readonly order = 2;
  private readonly genres: GenreRepository;
  private readonly discover: DiscoverRepository;

  constructor(genres: GenreRepository, discover: DiscoverRepository) {
    this.genres = genres;
    this.discover = discover;
  }

  async search({ query, filter }: SearchRequest): Promise<SearchPartial> {
    if (query.folded.length < 3) return EMPTY_SEARCH_RESULTS;

    const all = await this.genres.all();
    const matched = all.find((genre) => matchesName(query.folded, foldText(genre.name)));
    if (!matched) return EMPTY_SEARCH_RESULTS;

    const kinds: MediaKind[] = filter.kind === 'all' ? ['movie', 'tv'] : [filter.kind];
    const pages = await Promise.all(kinds.map((kind) => this.discover.byGenre(kind, matched.id)));
    return { titles: pages.flatMap((page) => page.items), people: [] };
  }
}