import type { ContentContext, ContentPolicy, FilterableTitle } from './ContentPolicy';

export class BlockedTitlePolicy implements ContentPolicy {
  readonly id = 'blocked-title';
  readonly order = 30;

  allows(title: FilterableTitle, { settings }: ContentContext): boolean {
    return !settings.blockedTitles.some((blocked) => blocked.titleId === title.id);
  }
}