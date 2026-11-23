import { NotFoundError } from '@/core/errors/NotFoundError';

import type { TitleDetails } from '../entities/Title';
import { makeTitleId, parseTitleId } from '../entities/TitleId';
import type { TitleRepository } from '../repositories/TitleRepository';

const MAX_CAST = 20;

export class GetTitleDetails {
  private readonly titles: TitleRepository;

  constructor(titles: TitleRepository) {
    this.titles = titles;
  }

  async execute(id: string): Promise<TitleDetails> {
    const parsed = parseTitleId(id);
    if (!parsed) throw new NotFoundError('Invalid title id', { resource: 'title' });

    const titleId = makeTitleId(parsed.kind, parsed.tmdbId);
    const [title, credits] = await Promise.all([
      this.titles.details(titleId),
      this.titles.credits(titleId).catch(() => ({ cast: [], crew: [] })),
    ]);

    return { title, cast: credits.cast.slice(0, MAX_CAST), crew: credits.crew };
  }
}