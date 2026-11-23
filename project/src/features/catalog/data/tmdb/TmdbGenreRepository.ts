import type { Genre } from '../../domain/entities/Genre';
import type { MediaKind } from '../../domain/entities/TitleId';
import type { GenreRepository } from '../../domain/repositories/GenreRepository';
import type { TmdbGenreListDto } from './dto/TmdbCommonDto';
import type { TmdbClient } from './TmdbClient';

export class TmdbGenreRepository implements GenreRepository {
  private readonly client: TmdbClient;

  constructor(client: TmdbClient) {
    this.client = client;
  }

  async list(kind: MediaKind): Promise<Genre[]> {
    const dto = await this.client.get<TmdbGenreListDto>(`/genre/${kind}/list`);
    return dto.genres.map((genre) => ({ id: genre.id, name: genre.name }));
  }

  async all(): Promise<Genre[]> {
    const [movie, tv] = await Promise.all([this.list('movie'), this.list('tv')]);
    const byId = new Map<number, Genre>();
    [...movie, ...tv].forEach((genre) => {
      if (!byId.has(genre.id)) byId.set(genre.id, genre);
    });
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
}