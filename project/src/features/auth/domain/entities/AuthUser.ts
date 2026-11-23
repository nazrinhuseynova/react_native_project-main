export type AuthUser = {
  id: string;
  email: string;
  emailConfirmed: boolean;
  provider: string;
  avatarUrl: string | null;
  createdAt: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}