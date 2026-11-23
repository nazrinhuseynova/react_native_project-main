import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

import type { Title } from '../../domain/entities/Title';
import type { TitleId } from '../../domain/entities/TitleId';

export type BackdropCardTitle = Pick<Title, 'id' | 'name' | 'backdrop' | 'poster'>;

type BackdropCardProps = {
  title: BackdropCardTitle;
  width?: number;
  onPress?: (id: TitleId) => void;
  children?: ReactNode;
};

export function BackdropCard({ title, width = 240, onPress, children }: BackdropCardProps) {
  const { colors, radius, spacing } = useTheme();
  const height = Math.round((width * 9) / 16);
  const artwork = title.backdrop ?? title.poster;

  return (
    <ScalePressable
      {...buttonA11y(title.name)}
      onPress={() => onPress?.(title.id)}
      style={{
        width,
        height,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.skeleton,
      }}
    >
      {artwork ? (
        <Image
          source={{ uri: artwork.medium }}
          contentFit="cover"
          transition={150}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
      <View
        style={{
          position: 'absolute',
          left: spacing.sm,
          right: spacing.sm,
          bottom: spacing.sm + (children ? 6 : 0),
        }}
      >
        <AppText variant="captionStrong" color="#FFFFFF" numberOfLines={1}>
          {title.name}
        </AppText>
      </View>
      {children}
    </ScalePressable>
  );
}