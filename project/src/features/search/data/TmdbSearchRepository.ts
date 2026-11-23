import {
  mapMediaItem,
  mapPage,
  type TmdbClient,
  type TmdbImageUrlBuilder,
  type TmdbMediaItemDto,
  type TmdbPageDto,
  type Title,
} from '@/features/catalog';

import type { SearchKind } from '../domain/entities/SearchFilter';
import type { PersonResult } from '../domain/entities/SearchResult';
import type { SearchRepository } from '../domain/repositories/SearchRepository';

type TmdbPersonSearchDto = {
  id: number;
  name: string;
  known_for_department?: string | null;
  profile_path: string | null;
  known_for?: TmdbMediaItemDto[];
};

export class TmdbSearchRepository implements SearchRepository {
  private readonly client: TmdbClient;
  private readonly images: TmdbImageUrlBuilder;

  constructor(client: TmdbClient, images: TmdbImageUrlBuilder) {
    this.client = client;
    this.images = images;
  }

  async titles(query: string, kind: SearchKind): Promise<Title[]> {
    const params = { query, page: 1, include_adult: false };

    if (kind === 'all') {
      const dto = await this.client.get<TmdbPageDto<TmdbMediaItemDto>>('/search/multi', params);
      return mapPage(dto, (item) => mapMediaItem(item, this.images)).items;
    }

    const dto = await this.client.get<TmdbPageDto<TmdbMediaItemDto>>(`/search/${kind}`, params);
    return mapPage(dto, (item) => mapMediaItem(item, this.images, kind)).items;
  }

  async people(query: string): Promise<PersonResult[]> {
    const dto = await this.client.get<TmdbPageDto<TmdbPersonSearchDto>>('/search/person', {
      query,
      page: 1,
      include_adult: false,
    });

    return dto.results.map((person) => ({
      id: person.id,
      name: person.name,
      department: person.known_for_department ?? null,
      profile: this.images.profile(person.profile_path),
      knownFor: (person.known_for ?? [])
        .map((item) => mapMediaItem(item, this.images))
        .filter((title): title is Title => title !== null),
    }));
  }
}