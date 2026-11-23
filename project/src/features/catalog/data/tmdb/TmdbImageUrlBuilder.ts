import type { Artwork } from '../../domain/entities/Title';

const BASE_URL = 'https://image.tmdb.org/t/p/';

function build(path: string | null, small: string, medium: string, large: string): Artwork | null {
  if (!path) return null;
  return {
    small: `${BASE_URL}${small}${path}`,
    medium: `${BASE_URL}${medium}${path}`,
    large: `${BASE_URL}${large}${path}`,
  };
}

export class TmdbImageUrlBuilder {
  poster(path: string | null): Artwork | null {
    return build(path, 'w185', 'w342', 'w780');
  }

  backdrop(path: string | null): Artwork | null {
    return build(path, 'w300', 'w780', 'w1280');
  }

  profile(path: string | null): Artwork | null {
    return build(path, 'w45', 'w185', 'h632');
  }

  still(path: string | null): Artwork | null {
    return build(path, 'w185', 'w300', 'w780');
  }
}