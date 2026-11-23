import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';

const TMDB_URL = 'https://www.themoviedb.org';

export function TmdbAttribution() {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  return (
    <View style={{ padding: spacing.lg, gap: spacing.sm, alignItems: 'center' }}>
      <ScalePressable
        {...buttonA11y('TMDB')}
        onPress={() => void WebBrowser.openBrowserAsync(TMDB_URL)}
      >
        <AppText variant="title3" weight="800" color="info">
          TMDB
        </AppText>
      </ScalePressable>
      <AppText variant="caption" color="textMuted" align="center">
        {t('catalog.attribution')}
      </AppText>
    </View>
  );
}