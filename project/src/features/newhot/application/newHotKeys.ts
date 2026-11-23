export const newHotKeys = {
  all: ['newhot'] as const,
  upcoming: (language: string) => ['newhot', 'upcoming', language] as const,
  reminders: (userId: string | null) => ['newhot', 'reminders', userId] as const,
};