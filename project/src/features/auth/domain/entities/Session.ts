import type { AuthUser } from './AuthUser';

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
  user: AuthUser;
};