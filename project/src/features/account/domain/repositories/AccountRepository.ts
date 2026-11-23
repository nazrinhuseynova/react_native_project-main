export type DeletionStatus =
  | { pending: false }
  | { pending: true; requestedAt: string; reason: string | null };

export interface AccountRepository {
  verifyPassword(email: string, password: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  requestEmailChange(newEmail: string): Promise<void>;
  markDeletion(reason: string | null): Promise<string>;
  getDeletionStatus(): Promise<DeletionStatus>;
  restore(): Promise<void>;
}