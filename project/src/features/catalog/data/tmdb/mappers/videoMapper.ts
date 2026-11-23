import type { Video } from '../../../domain/entities/Video';
import type { TmdbVideoDto } from '../dto/TmdbVideoDto';

export function mapVideos(dto: TmdbVideoDto): Video[] {
  return (dto.results ?? []).map((video) => ({
    id: video.id,
    key: video.key,
    site: video.site,
    name: video.name,
    type: video.type,
    official: video.official ?? false,
    publishedAt: video.published_at ?? null,
  }));
}