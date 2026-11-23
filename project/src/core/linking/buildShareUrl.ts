import { DEEP_LINK_SCHEME } from '@/core/config/constants';

export function buildShareUrl(path: string, query: Record<string, string | undefined> = {}): string {
  const cleanPath = path.replace(/^\/+/, '');
  const search = Object.entries(query)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${DEEP_LINK_SCHEME}://${cleanPath}${search ? `?${search}` : ''}`;
}

export function buildTitleShareUrl(id: string | number, mediaType: 'movie' | 'tv'): string {
  return buildShareUrl(`movie/${id}`, { type: mediaType });
}