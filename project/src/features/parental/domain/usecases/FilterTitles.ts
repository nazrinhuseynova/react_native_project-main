import type { ContentContext, ContentPolicy, FilterableTitle } from '../policies/ContentPolicy';

export class FilterTitles {
  private readonly policy: ContentPolicy;

  constructor(policy: ContentPolicy) {
    this.policy = policy;
  }

  execute<T extends FilterableTitle>(titles: readonly T[], context: ContentContext): T[] {
    return titles.filter((title) => this.policy.allows(title, context));
  }
}