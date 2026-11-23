import type { SearchPartial } from '../entities/SearchResult';
import type { SearchRepository } from '../repositories/SearchRepository';
import type { SearchRequest, SearchStrategy } from './SearchStrategy';

const MAX_PEOPLE = 5;

export class PersonSearchStrategy implements SearchStrategy {
  readonly id = 'person';
  readonly order = 1;
  private readonly repository: SearchRepository;

  constructor(repository: SearchRepository) {
    this.repository = repository;
  }

  async search({ query }: SearchRequest): Promise<SearchPartial> {
    const found = await this.repository.people(query.text);
    const people = found.filter((person) => person.knownFor.length > 0).slice(0, MAX_PEOPLE);
    return { titles: people.flatMap((person) => person.knownFor), people };
  }
}