export const homeKeys = {
  all: ['home'] as const,
  row: (rowId: string, profileId: string, language: string, category: string) =>
    ['home', 'row', rowId, profileId, language, category] as const,
  hero: (profileId: string | null, language: string, variant: string) =>
    ['home', 'hero', profileId, language, variant] as const,
  savedIds: (profileId: string | null) => ['home', 'saved', profileId] as const,
  preferredGenres: ['home', 'preferredGenres'] as const,
};