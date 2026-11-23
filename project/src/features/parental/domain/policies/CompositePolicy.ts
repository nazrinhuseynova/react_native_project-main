import type { ContentContext, ContentPolicy, FilterableTitle } from './ContentPolicy';


export class CompositePolicy implements ContentPolicy {
  readonly id = 'composite';
  readonly order = 0;
  private readonly policies: readonly ContentPolicy[];

  constructor(policies: readonly ContentPolicy[]) {
    this.policies = [...policies].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  allows(title: FilterableTitle, context: ContentContext): boolean {
    return this.policies.every((policy) => policy.allows(title, context));
  }


  firstDenial(title: FilterableTitle, context: ContentContext): ContentPolicy | null {
    return this.policies.find((policy) => !policy.allows(title, context)) ?? null;
  }
}