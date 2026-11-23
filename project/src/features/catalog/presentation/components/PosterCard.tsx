import { Image } from 'expo-image';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

import type { Title } from '../../domain/entities/Title';
import type { TitleId } from '../../domain/entities/TitleId';

export type PosterCardTitle = Pick<Title, 'id' | 'name' | 'poster'>;

type PosterCardProps = {
  title: PosterCardTitle;
  width?: number;
  label?: string;
  onPress?: (id: TitleId) => void;
};

export function PosterCard({ title, width = 118, label, onPress }: PosterCardProps) {
  const { colors, radius, spacing } = useTheme();
  const height = Math.round(width * 1.5);

  return (
    <ScalePressable
      {...buttonA11y(label ?? title.name)}
      onPress={() => onPress?.(title.id)}
      style={{
        width,
        height,
        borderRadius: radius.sm,
        overflow: 'hidden',
        backgroundColor: colors.skeleton,
      }}
    >
      {title.poster ? (
        <Image
          source={{ uri: title.poster.medium }}
          contentFit="cover"
          transition={150}
          style={{ width, height }}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.sm }}>
          <AppText variant="captionStrong" align="center" color="textSecondary" numberOfLines={4}>
            {title.name}
          </AppText>
        </View>
      )}
    </ScalePressable>
  );
}