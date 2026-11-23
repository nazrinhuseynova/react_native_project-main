import { NotFoundError } from '@/core/errors/NotFoundError';

import type { Title } from '../entities/Title';
import { makeTitleId, parseTitleId } from '../entities/TitleId';
import type { TitleRepository } from '../repositories/TitleRepository';

const MIN_RECOMMENDATIONS = 8;

export class GetRecommendations {
  private readonly titles: TitleRepository;

  constructor(titles: TitleRepository) {
    this.titles = titles;
  }

  async execute(id: string, limit = 20): Promise<Title[]> {
    const parsed = parseTitleId(id);
    if (!parsed) throw new NotFoundError('Invalid title id', { resource: 'title' });
    const titleId = makeTitleId(parsed.kind, parsed.tmdbId);

    let items = (await this.titles.recommendations(titleId)).items;
    if (items.length < MIN_RECOMMENDATIONS) {
      const similar = await this.titles.similar(titleId).catch(() => null);
      if (similar) items = [...items, ...similar.items];
    }

    const seen = new Set<string>([titleId]);
    const unique: Title[] = [];
    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      unique.push(item);
    }
    return unique.slice(0, limit);
  }
}