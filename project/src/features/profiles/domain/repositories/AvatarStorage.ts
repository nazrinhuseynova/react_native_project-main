import type { AvatarInput } from '../entities/Profile';

export type UploadedAvatar = {
  url: string;
  key: string;
};

export interface AvatarStorage {
  upload(localUri: string): Promise<UploadedAvatar>;
  remove(key: string): Promise<void>;
}

export type ResolvedAvatar = {
  avatarPreset: string | null;
  avatarUrl: string | null;
  avatarKey: string | null;
};

export async function resolveAvatar(
  input: AvatarInput,
  storage: AvatarStorage,
): Promise<ResolvedAvatar> {
  if (input.kind === 'preset') {
    return { avatarPreset: input.presetId, avatarUrl: null, avatarKey: null };
  }
  const uploaded = await storage.upload(input.localUri);
  return { avatarPreset: null, avatarUrl: uploaded.url, avatarKey: uploaded.key };
}