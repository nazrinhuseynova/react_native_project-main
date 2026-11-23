import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
 
import { checkboxA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
  error?: string | null;
}
 
export function Checkbox({ checked, onChange, label, children, disabled = false, error }: CheckboxProps) {
  const { colors, radius, spacing } = useTheme();
 
  return (
    <View>
      <ScalePressable
        {...checkboxA11y(label ?? 'Checkbox', checked, disabled)}
        disabled={disabled}
        onPress={() => onChange(!checked)}
        scaleTo={0.98}
        style={styles.row}
      >
        <View
          style={[
            styles.box,
            {
              borderRadius: radius.xs + 2,
              borderColor: error ? colors.danger : checked ? colors.primary : colors.inputBorder,
              backgroundColor: checked ? colors.primary : 'transparent',
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {checked ? <Ionicons name="checkmark" size={16} color={colors.textOnPrimary} /> : null}
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          {children ?? (label ? <AppText variant="callout">{label}</AppText> : null)}
        </View>
      </ScalePressable>
      {error ? (
        <AppText variant="caption" color="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  box: { width: 22, height: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
