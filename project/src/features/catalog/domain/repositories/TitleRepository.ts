import type { Paginated } from '@/shared/types/common';

import type { TitleCredits } from '../entities/CastMember';
import type { Season } from '../entities/Season';
import type { Title } from '../entities/Title';
import type { TitleId } from '../entities/TitleId';
import type { Video } from '../entities/Video';

export interface TitleRepository {
  details(id: TitleId): Promise<Title>;
  credits(id: TitleId): Promise<TitleCredits>;
  similar(id: TitleId, page?: number): Promise<Paginated<Title>>;
  recommendations(id: TitleId, page?: number): Promise<Paginated<Title>>;
  videos(id: TitleId): Promise<Video[]>;
  season(id: TitleId, seasonNumber: number): Promise<Season>;
}