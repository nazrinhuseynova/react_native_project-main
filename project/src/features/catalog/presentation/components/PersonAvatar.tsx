import { Image } from 'expo-image';
import { View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

import type { Artwork } from '../../domain/entities/Title';

type PersonAvatarProps = {
  name: string;
  subtitle?: string;
  profile: Artwork | null;
  size?: number;
  onPress?: () => void;
};

export function PersonAvatar({ name, subtitle, profile, size = 88, onPress }: PersonAvatarProps) {
  const { colors, spacing } = useTheme();

  return (
    <ScalePressable
      {...buttonA11y(subtitle ? `${name}, ${subtitle}` : name)}
      disabled={!onPress}
      onPress={onPress}
      style={{ width: size + spacing.md, alignItems: 'center' }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.skeleton,
        }}
      >
        {profile ? (
          <Image
            source={{ uri: profile.medium }}
            contentFit="cover"
            transition={150}
            style={{ width: size, height: size }}
          />
        ) : (
          <Ionicons name="person" size={size / 2} color={colors.textMuted} />
        )}
      </View>
      <AppText variant="captionStrong" align="center" numberOfLines={2} style={{ marginTop: spacing.xs }}>
        {name}
      </AppText>
      {subtitle ? (
        <AppText variant="caption" color="textSecondary" align="center" numberOfLines={1}>
          {subtitle}
        </AppText>
      ) : null}
    </ScalePressable>
  );
}