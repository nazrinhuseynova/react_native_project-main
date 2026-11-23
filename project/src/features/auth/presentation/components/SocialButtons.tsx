import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AuthButton, authPalette } from './AuthForm';

type SocialButtonsProps = {
  onGooglePress: () => void;
  disabled?: boolean;
};

export function SocialButtons({ onGooglePress, disabled = false }: SocialButtonsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>{t('auth.social.divider')}</Text>
        <View style={styles.line} />
      </View>
      <AuthButton
        variant="secondary"
        label={t('auth.social.google')}
        onPress={onGooglePress}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: authPalette.border },
  dividerText: { color: authPalette.muted, fontSize: 13 },
});