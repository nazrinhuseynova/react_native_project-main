import { findAvatarOption } from '../../domain/entities/AvatarOption';
import type { Profile } from '../../domain/entities/Profile';
import { Avatar } from '@/shared/ui/Avatar';

type ProfileAvatarProps = {
  profile: Pick<Profile, 'name' | 'avatarPreset' | 'avatarUrl'>;
  size?: number;
};

export function ProfileAvatar({ profile, size = 72 }: ProfileAvatarProps) {
  const option = findAvatarOption(profile.avatarPreset);
  return <Avatar uri={profile.avatarUrl} name={profile.name} size={size} color={option.color} />;
}