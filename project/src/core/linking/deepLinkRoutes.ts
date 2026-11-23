import type { DeepLinkRoute } from './DeepLinkRegistry';

const MEDIA_TYPES = ['movie', 'tv'] as const;

type MediaType = (typeof MEDIA_TYPES)[number];

function isMediaType(value: string | undefined): value is MediaType {
  return value === 'movie' || value === 'tv';
}

export const deepLinkRoutes: readonly DeepLinkRoute[] = [
  {
    id: 'movie',
    order: 10,
    pattern: 'movie/:id',
    handledByRouter: true,
    toTarget: ({ params, query }) => ({
      pathname: '/movie/[id]',
      params: { id: params.id, type: isMediaType(query.type) ? query.type : 'movie' },
    }),
  },
  {
    id: 'title',
    order: 20,
    pattern: 'title/:mediaType/:id',
    toTarget: ({ params }) =>
      isMediaType(params.mediaType)
        ? { pathname: '/movie/[id]', params: { id: params.id, type: params.mediaType } }
        : null,
  },
  {
    id: 'watch',
    order: 30,
    pattern: 'watch/:id',
    toTarget: ({ params, query }) => ({
      pathname: '/player/[id]',
      params: {
        id: params.id,
        ...(query.episodeId ? { episodeId: query.episodeId } : {}),
      },
    }),
  },
  {
    id: 'person',
    order: 40,
    pattern: 'person/:id',
    handledByRouter: true,
    toTarget: ({ params }) => ({ pathname: '/person/[id]', params: { id: params.id } }),
  },
  {
    id: 'genre',
    order: 50,
    pattern: 'genre/:id',
    handledByRouter: true,
    toTarget: ({ params }) => ({ pathname: '/genre/[id]', params: { id: params.id } }),
  },
];