import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { authPalette } from './AuthForm';

type TermsCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.box, checked ? styles.boxChecked : null]}>
          {checked ? <Text style={styles.tick}>✓</Text> : null}
        </View>
        <Text style={styles.label}>{t('auth.terms.accept')}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{t(error)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: authPalette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: authPalette.primary, borderColor: authPalette.primary },
  tick: { color: authPalette.text, fontSize: 14, fontWeight: '800' },
  label: { flex: 1, color: authPalette.muted, fontSize: 13 },
  error: { color: authPalette.danger, fontSize: 12 },
});