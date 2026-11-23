export const libraryKeys = {
  all: ['library'] as const,
  list: (profileId: string | null) => ['library', 'list', profileId] as const,
};