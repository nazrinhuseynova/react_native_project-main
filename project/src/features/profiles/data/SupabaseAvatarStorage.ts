import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import { AuthError } from '@/core/errors/AuthError';
import { createId } from '@/core/utils/createId';

import type { AvatarStorage, UploadedAvatar } from '../domain/repositories/AvatarStorage';

const BUCKET = 'avatars';

function guessType(uri: string): { ext: string; contentType: string } {
  const ext = uri.split('?')[0]?.split('.').pop()?.toLowerCase() ?? 'jpg';
  if (ext === 'png') return { ext: 'png', contentType: 'image/png' };
  if (ext === 'webp') return { ext: 'webp', contentType: 'image/webp' };
  return { ext: 'jpg', contentType: 'image/jpeg' };
}

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'AVATAR', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseAvatarStorage implements AvatarStorage {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async upload(localUri: string): Promise<UploadedAvatar> {
    const { data: auth } = await this.client.auth.getSession();
    const userId = auth.session?.user.id;
    if (!userId) throw new AuthError('No active session', { reason: 'unauthorized' });

    const { ext, contentType } = guessType(localUri);
    const key = `${userId}/${createId()}.${ext}`;

    let body: ArrayBuffer;
    try {
      body = await (await fetch(localUri)).arrayBuffer();
    } catch (error) {
      throw toError('Failed to read image', error);
    }

    const { error } = await this.client.storage.from(BUCKET).upload(key, body, { contentType });
    if (error) throw toError('Failed to upload avatar', error);

    const { data } = this.client.storage.from(BUCKET).getPublicUrl(key);
    return { url: data.publicUrl, key };
  }

  async remove(key: string): Promise<void> {
    const { error } = await this.client.storage.from(BUCKET).remove([key]);
    if (error) throw toError('Failed to remove avatar', error);
  }
}