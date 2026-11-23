export const reviewKeys = {
  all: ['reviews'] as const,
  title: (titleId: string | null) => ['reviews', 'title', titleId] as const,
  mine: (userId: string | null, titleId: string | null) => ['reviews', 'mine', userId, titleId] as const,
  user: (userId: string | null) => ['reviews', 'user', userId] as const,
  reaction: (userId: string | null, titleId: string | null) =>
    ['reviews', 'reaction', userId, titleId] as const,
};