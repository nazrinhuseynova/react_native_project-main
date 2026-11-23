import { StyleSheet, Switch, View } from 'react-native';
 
import { switchA11y } from '../a11y/accessibilityProps';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface SwitchRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
}
 
export function SwitchRow({ label, value, onValueChange, description, disabled = false }: SwitchRowProps) {
  const { colors, spacing } = useTheme();
 
  return (
    <View
      {...switchA11y(label, value, disabled)}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => !disabled && onValueChange(!value)}
      style={[styles.row, { paddingVertical: spacing.md }]}
    >
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <AppText variant="body">{label}</AppText>
        {description ? (
          <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.xxs }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
});
