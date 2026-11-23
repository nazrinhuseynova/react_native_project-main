import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrailers, youTubeUrl, type Title } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';

type DetailsHeaderProps = {
  title: Title;
  onBack: () => void;
};

export function DetailsHeader({ title, onBack }: DetailsHeaderProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { trailer } = useTrailers(title.id);

  const height = Math.round((width * 9) / 16) + insets.top;
  const artwork = title.backdrop ?? title.poster;

  return (
    <View style={{ width, height, backgroundColor: colors.skeleton }}>
      {artwork ? (
        <Image source={{ uri: artwork.large }} contentFit="cover" transition={200} style={StyleSheet.absoluteFill} />
      ) : null}
      <LinearGradient
        colors={['transparent', colors.background]}
        style={StyleSheet.absoluteFill}
        locations={[0.4, 1]}
      />

      <IconButton
        icon="chevron-back"
        filled
        accessibilityLabel={t('common.back')}
        onPress={onBack}
        style={{ position: 'absolute', top: insets.top + spacing.sm, left: spacing.md }}
      />

      {trailer ? (
        <ScalePressable
          {...buttonA11y(t('details.trailer'))}
          onPress={() => void WebBrowser.openBrowserAsync(youTubeUrl(trailer))}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: height / 2 - 28 + insets.top / 2,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.overlay,
            borderWidth: 1,
            borderColor: colors.text,
          }}
        >
          <Ionicons name="play" size={26} color={colors.text} />
        </ScalePressable>
      ) : null}

      <View style={{ position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.sm }}>
        <AppText variant="title1" numberOfLines={2}>
          {title.name}
        </AppText>
      </View>
    </View>
  );
}