export const profileKeys = {
  all: ['profiles'] as const,
  list: (userId: string | null) => ['profiles', 'list', userId] as const,
};