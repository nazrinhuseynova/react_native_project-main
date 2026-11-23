export const playerKeys = {
  all: ['player'] as const,
  session: (titleId: string | null, episodeId: string | null) =>
    ['player', 'session', titleId, episodeId] as const,
  segments: (titleId: string | null, episodeId: string | null) =>
    ['player', 'segments', titleId, episodeId] as const,
};