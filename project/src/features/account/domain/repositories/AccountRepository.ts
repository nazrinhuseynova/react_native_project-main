export interface AccountRepository {
  verifyPassword(email: string, password: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  requestEmailChange(newEmail: string): Promise<void>;
  deleteAccount(reason: string | null): Promise<void>;
}