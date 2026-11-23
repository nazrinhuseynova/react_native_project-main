import type { SearchRepository } from '../repositories/SearchRepository';
import type { SearchPartial } from '../entities/SearchResult';
import type { SearchRequest, SearchStrategy } from './SearchStrategy';

export class TitleSearchStrategy implements SearchStrategy {
  readonly id = 'title';
  readonly order = 0;
  private readonly repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  async search({ query, filter }: SearchRequest): Promise<SearchPartial> {
    const titles = await this.repository.titles(query.text, filter.kind);
    return { titles, people: [] };
  }
}