import { NotFoundError } from '@/core/errors/NotFoundError';

import type { Season } from '../entities/Season';
import { makeTitleId, parseTitleId } from '../entities/TitleId';
import type { TitleRepository } from '../repositories/TitleRepository';

export class GetSeason {
  private readonly titles: TitleRepository;

  constructor(titles: TitleRepository) {
    this.titles = titles;
  }

  execute(id: string, seasonNumber: number): Promise<Season> {
    const parsed = parseTitleId(id);
    if (!parsed || parsed.kind !== 'tv' || !Number.isInteger(seasonNumber) || seasonNumber < 0) {
      return Promise.reject(new NotFoundError('Season not found', { resource: 'season' }));
    }
    return this.titles.season(makeTitleId('tv', parsed.tmdbId), seasonNumber);
  }
}