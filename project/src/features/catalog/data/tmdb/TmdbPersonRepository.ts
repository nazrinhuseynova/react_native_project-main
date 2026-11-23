import type { Person } from '../../domain/entities/Person';
import type { Title } from '../../domain/entities/Title';
import type { PersonRepository } from '../../domain/repositories/PersonRepository';
import type { TmdbCombinedCreditsDto, TmdbPersonDto } from './dto/TmdbCommonDto';
import { mapPerson } from './mappers/creditsMapper';
import { mapMediaItem } from './mappers/pageMapper';
import type { TmdbClient } from './TmdbClient';
import type { TmdbImageUrlBuilder } from './TmdbImageUrlBuilder';

const MAX_CREDITS = 60;

export class TmdbPersonRepository implements PersonRepository {
  private readonly client: TmdbClient;
  private readonly images: TmdbImageUrlBuilder;

  constructor(client: TmdbClient, images: TmdbImageUrlBuilder) {
    this.client = client;
    this.images = images;
  }

  async details(personId: number): Promise<Person> {
    const dto = await this.client.get<TmdbPersonDto>(`/person/${personId}`);
    return mapPerson(dto, this.images);
  }

  async credits(personId: number): Promise<Title[]> {
    const dto = await this.client.get<TmdbCombinedCreditsDto>(`/person/${personId}/combined_credits`);

    const seen = new Set<string>();
    const titles: Title[] = [];
    for (const item of dto.cast ?? []) {
      const title = mapMediaItem(item, this.images);
      if (!title || seen.has(title.id)) continue;
      seen.add(title.id);
      titles.push(title);
    }
    return titles.sort((a, b) => b.popularity - a.popularity).slice(0, MAX_CREDITS);
  }
}