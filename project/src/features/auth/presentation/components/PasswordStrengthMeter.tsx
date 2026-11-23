import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { authPalette } from './AuthForm';

type Level = 'weak' | 'medium' | 'strong';

type PasswordStrengthMeterProps = {
  level: Level | null;
};

const FILLED: Record<Level, number> = { weak: 1, medium: 2, strong: 3 };
const COLORS: Record<Level, string> = {
  weak: authPalette.danger,
  medium: '#F5A623',
  strong: '#2ECC71',
};

export function PasswordStrengthMeter({ level }: PasswordStrengthMeterProps) {
  const { t } = useTranslation();
  if (!level) return null;

  return (
    <View style={styles.container} accessibilityLabel={t(`auth.strength.${level}`)}>
      <View style={styles.bars}>
        {[1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.bar,
              { backgroundColor: index <= FILLED[level] ? COLORS[level] : authPalette.border },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: COLORS[level] }]}>{t(`auth.strength.${level}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 12, fontWeight: '600' },
});