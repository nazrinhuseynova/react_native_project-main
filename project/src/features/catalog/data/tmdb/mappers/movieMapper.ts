import { pickCertification, type Certification } from '../../../domain/entities/Certification';
import type { Movie } from '../../../domain/entities/Title';
import { makeTitleId } from '../../../domain/entities/TitleId';
import type { TmdbMovieDto } from '../dto/TmdbMovieDto';
import type { TmdbImageUrlBuilder } from '../TmdbImageUrlBuilder';

export type MovieMapOptions = {
  certification?: string | null;
};

function certificationsOf(dto: TmdbMovieDto): Certification[] {
  return (dto.release_dates?.results ?? []).flatMap((entry) => {
    const rating = entry.release_dates.find((item) => item.certification)?.certification;
    return rating ? [{ country: entry.iso_3166_1, rating }] : [];
  });
}

export function mapMovie(
  dto: TmdbMovieDto,
  images: TmdbImageUrlBuilder,
  options: MovieMapOptions = {},
): Movie {
  return {
    kind: 'movie',
    id: makeTitleId('movie', dto.id),
    tmdbId: dto.id,
    name: dto.title,
    originalName: dto.original_title,
    overview: dto.overview ?? '',
    tagline: dto.tagline || null,
    poster: images.poster(dto.poster_path),
    backdrop: images.backdrop(dto.backdrop_path),
    releaseDate: dto.release_date || null,
    voteAverage: dto.vote_average ?? 0,
    voteCount: dto.vote_count ?? 0,
    popularity: dto.popularity ?? 0,
    genreIds: dto.genre_ids ?? dto.genres?.map((genre) => genre.id) ?? [],
    genres: dto.genres ?? [],
    adult: dto.adult ?? false,
    certification: options.certification ?? pickCertification(certificationsOf(dto)),
    originalLanguage: dto.original_language,
    imdbId: dto.imdb_id || null,
    runtimeMinutes: dto.runtime || null,
  };
}