export const historyKeys = {
  all: ['history'] as const,
  continue: (profileId: string | null) => ['history', 'continue', profileId] as const,
  watched: (profileId: string | null) => ['history', 'watched', profileId] as const,
  progress: (profileId: string | null, titleId: string | null) =>
    ['history', 'progress', profileId, titleId] as const,
};