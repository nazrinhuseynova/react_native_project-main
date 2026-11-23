export { GenreScreen } from './presentation/screens/GenreScreen';
export { PersonScreen } from './presentation/screens/PersonScreen';

export { BackdropCard } from './presentation/components/BackdropCard';
export { PersonAvatar } from './presentation/components/PersonAvatar';
export { PosterCard } from './presentation/components/PosterCard';
export { RatingBadge } from './presentation/components/RatingBadge';
export { TitleGrid } from './presentation/components/TitleGrid';
export { TmdbAttribution } from './presentation/components/TmdbAttribution';

export { useDiscoverRow } from './application/hooks/useDiscoverRow';
export { useGenres } from './application/hooks/useGenres';
export { usePerson } from './application/hooks/usePerson';
export { useRatings } from './application/hooks/useRatings';
export { useSeason } from './application/hooks/useSeason';
export { useSimilarTitles } from './application/hooks/useSimilarTitles';
export { useTitleDetails } from './application/hooks/useTitleDetails';
export { useTrailers } from './application/hooks/useTrailers';
export { catalogKeys } from './application/catalogKeys';

export type { CastMember, CrewMember, TitleCredits } from './domain/entities/CastMember';
export type { Certification } from './domain/entities/Certification';
export type { Episode } from './domain/entities/Episode';
export type { Genre } from './domain/entities/Genre';
export type { Person } from './domain/entities/Person';
export type { Season, SeasonSummary } from './domain/entities/Season';
export type { Artwork, Movie, Series, Title, TitleDetails } from './domain/entities/Title';
export type { MediaKind, TitleId } from './domain/entities/TitleId';
export type { Video } from './domain/entities/Video';
export type {
  DiscoverKind,
  DiscoverQuery,
  DiscoverRepository,
  TrendingWindow,
} from './domain/repositories/DiscoverRepository';
export type { GenreRepository } from './domain/repositories/GenreRepository';
export type { PersonRepository } from './domain/repositories/PersonRepository';
export type { Rating, RatingQuery, RatingSource } from './domain/repositories/RatingSource';
export type { TitleRepository } from './domain/repositories/TitleRepository';

export {
  isMediaKind,
  isTitleId,
  makeTitleId,
  parseTitleId,
  titleIdFromRoute,
  toRouteParams,
} from './domain/entities/TitleId';
export { directorsOf } from './domain/entities/CastMember';
export { pickTrailer, youTubeUrl } from './domain/entities/Video';
export { isMovie, isSeries, releaseYear } from './domain/entities/Title';
export { runDiscoverQuery } from './domain/repositories/DiscoverRepository';


export { GetRecommendations } from './domain/usecases/GetRecommendations';
export { GetSeason } from './domain/usecases/GetSeason';
export { GetTitleDetails } from './domain/usecases/GetTitleDetails';
export { OMDB_BASE_URL, OmdbImdbRatingSource } from './data/ratings/OmdbImdbRatingSource';
export { TmdbRatingSource } from './data/ratings/TmdbRatingSource';
export { TMDB_BASE_URL, TmdbClient, toTmdbLanguage } from './data/tmdb/TmdbClient';
export { TmdbDiscoverRepository } from './data/tmdb/TmdbDiscoverRepository';
export { TmdbGenreRepository } from './data/tmdb/TmdbGenreRepository';
export { TmdbImageUrlBuilder } from './data/tmdb/TmdbImageUrlBuilder';
export { TmdbPersonRepository } from './data/tmdb/TmdbPersonRepository';
export { TmdbTitleRepository } from './data/tmdb/TmdbTitleRepository';

export { mapMediaItem, mapPage, withPoster } from './data/tmdb/mappers/pageMapper';
export type { TmdbMediaItemDto, TmdbPageDto } from './data/tmdb/dto/TmdbCommonDto';
export { useTitlesByIds } from './application/hooks/useTitlesByIds';