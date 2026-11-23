import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';

import type { BlockedTitle } from '../../domain/entities/ParentalSettings';

type BlockedTitleRowProps = {
  item: BlockedTitle;
  onUnblock: (item: BlockedTitle) => void;
  disabled?: boolean;
};

export function BlockedTitleRow({ item, onUnblock, disabled = false }: BlockedTitleRowProps) {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm }}>
      <View
        style={{
          width: 48,
          height: 72,
          borderRadius: radius.sm,
          overflow: 'hidden',
          backgroundColor: colors.skeleton,
          marginRight: spacing.md,
        }}
      >
        {item.posterUrl ? (
          <Image source={{ uri: item.posterUrl }} style={{ width: 48, height: 72 }} contentFit="cover" />
        ) : null}
      </View>
      <AppText variant="body" numberOfLines={2} style={{ flex: 1 }}>
        {item.title}
      </AppText>
      <IconButton
        icon="close-circle-outline"
        accessibilityLabel={t('parental.unblock')}
        disabled={disabled}
        onPress={() => onUnblock(item)}
      />
    </View>
  );
}