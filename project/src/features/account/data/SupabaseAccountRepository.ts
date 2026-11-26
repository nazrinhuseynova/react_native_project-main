import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { toAuthError } from '@/features/auth';

import type { AccountRepository } from '../domain/repositories/AccountRepository';

export class SupabaseAccountRepository implements AccountRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async verifyPassword(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw toAuthError(error);
  }

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ password: newPassword });
    if (error) throw toAuthError(error);
  }

  async requestEmailChange(newEmail: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ email: newEmail });
    if (error) throw toAuthError(error);
  }

  async deleteAccount(reason: string | null): Promise<void> {
    const { error } = await this.client.functions.invoke('delete-account', {
      body: { reason },
    });
    if (error) {
      throw new AppError('Failed to delete account', {
        code: 'ACCOUNT_DELETE',
        userMessageKey: 'account.errors.deleteFailed',
        cause: error,
      });
    }
  }
}