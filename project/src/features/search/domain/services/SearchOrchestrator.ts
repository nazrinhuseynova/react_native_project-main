import type { Title } from '@/features/catalog';
import type { Registry } from '@/core/registry/Registry';

import { matchesFilter } from '../entities/SearchFilter';
import type { PersonResult, SearchPartial, SearchResults } from '../entities/SearchResult';
import type { SearchRequest, SearchStrategy } from '../strategies/SearchStrategy';
import { foldText } from './normalizeQuery';

function nameScore(title: Title, folded: string): number {
  const name = foldText(title.name);
  if (name === folded) return 3;
  if (name.startsWith(folded)) return 2;
  if (name.includes(folded)) return 1;
  return 0;
}

export class SearchOrchestrator {
  private readonly strategies: Registry<SearchStrategy>;

  constructor(strategies: Registry<SearchStrategy>) {
    this.strategies = strategies;
  }

  async search(request: SearchRequest): Promise<SearchResults> {
    const settled = await Promise.allSettled(
      this.strategies.all().map((strategy) => strategy.search(request)),
    );

    const partials = settled
      .filter((item): item is PromiseFulfilledResult<SearchPartial> => item.status === 'fulfilled')
      .map((item) => item.value);

    const failure = settled.find((item): item is PromiseRejectedResult => item.status === 'rejected');
    if (partials.length === 0 && failure) throw failure.reason;

    const titles = new Map<string, Title>();
    const people = new Map<number, PersonResult>();
    for (const partial of partials) {
      partial.titles.forEach((title) => {
        if (!titles.has(title.id)) titles.set(title.id, title);
      });
      partial.people.forEach((person) => {
        if (!people.has(person.id)) people.set(person.id, person);
      });
    }

    const ranked = [...titles.values()]
      .filter((title) => matchesFilter(title, request.filter))
      .map((title) => ({ title, score: nameScore(title, request.query.folded) }))
      .sort((a, b) => b.score - a.score || b.title.popularity - a.title.popularity)
      .map((item) => item.title);

    return { titles: ranked, people: [...people.values()] };
  }
}