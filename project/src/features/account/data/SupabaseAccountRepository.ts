import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { AuthError } from '@/core/errors/AuthError';
import { toAuthError } from '@/features/auth';

import type { AccountRepository, DeletionStatus } from '../domain/repositories/AccountRepository';

const PROFILES = 'profiles';

type DeletionRow = { deleted_at: string; deletion_reason: string | null };

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'ACCOUNT', userMessageKey: 'errors.unknown', cause });
}

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

  async markDeletion(reason: string | null): Promise<string> {
    const userId = await this.currentUserId();
    const requestedAt = new Date().toISOString();

    const { error } = await this.client
      .from(PROFILES)
      .update({ deleted_at: requestedAt, deletion_reason: reason })
      .eq('user_id', userId);
    if (error) throw toError('Failed to request account deletion', error);

    return requestedAt;
  }

  async getDeletionStatus(): Promise<DeletionStatus> {
    const { data, error } = await this.client
      .from(PROFILES)
      .select('deleted_at,deletion_reason')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw toError('Failed to load deletion status', error);

    const row = data as DeletionRow | null;
    if (!row) return { pending: false };
    return { pending: true, requestedAt: row.deleted_at, reason: row.deletion_reason };
  }

  async restore(): Promise<void> {
    const userId = await this.currentUserId();
    const { error } = await this.client
      .from(PROFILES)
      .update({ deleted_at: null, deletion_reason: null })
      .eq('user_id', userId);
    if (error) throw toError('Failed to restore account', error);
  }

  private async currentUserId(): Promise<string> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw toAuthError(error);
    const id = data.session?.user.id;
    if (!id) throw new AuthError('No active session', { reason: 'unauthorized' });
    return id;
  }
}