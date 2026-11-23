import { Ionicons } from '@expo/vector-icons';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
 
import { buttonA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  error?: string | null;
  disabled?: boolean;
  leftAction?: ReactNode;
}
 
const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
] as const;
 
export function PinPad({ value, onChange, onComplete, length = 4, error, disabled = false, leftAction }: PinPadProps) {
  const { colors, spacing, sizes } = useTheme();
 
  useEffect(() => {
    if (value.length === length) onComplete?.(value);
  }, [value, length, onComplete]);
 
  const press = (digit: string) => {
    if (disabled || value.length >= length) return;
    onChange(value + digit);
  };
 
  const erase = () => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  };
 
  const keySize = sizes.controlLg + 8;
 
  const renderKey = (digit: string) => (
    <ScalePressable
      key={digit}
      {...buttonA11y(digit, { disabled })}
      disabled={disabled}
      onPress={() => press(digit)}
      haptic
      style={[styles.key, { width: keySize, height: keySize, borderRadius: keySize / 2, backgroundColor: colors.surfaceElevated }]}
    >
      <AppText variant="title2">{digit}</AppText>
    </ScalePressable>
  );
 
  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityLabel={`PIN, ${value.length} of ${length} digits entered`}
        style={[styles.dots, { marginBottom: spacing.md }]}
      >
        {Array.from({ length }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                borderColor: error ? colors.danger : colors.textSecondary,
                backgroundColor: index < value.length ? (error ? colors.danger : colors.text) : 'transparent',
              },
            ]}
          />
        ))}
      </View>
      <View style={{ minHeight: 20, marginBottom: spacing.lg }}>
        {error ? (
          <AppText variant="caption" color="danger" align="center" accessibilityLiveRegion="polite">
            {error}
          </AppText>
        ) : null}
      </View>
 
      {ROWS.map((row, index) => (
        <View key={index} style={[styles.row, { marginBottom: spacing.lg }]}>
          {row.map(renderKey)}
        </View>
      ))}
 
      <View style={styles.row}>
        <View style={[styles.slot, { width: keySize, height: keySize }]}>{leftAction}</View>
        {renderKey('0')}
        <ScalePressable
          {...buttonA11y('Delete', { disabled })}
          disabled={disabled}
          onPress={erase}
          style={[styles.key, { width: keySize, height: keySize, borderRadius: keySize / 2 }]}
        >
          <Ionicons name="backspace-outline" size={sizes.iconLg} color={colors.text} />
        </ScalePressable>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 24 },
  key: { alignItems: 'center', justifyContent: 'center' },
  slot: { alignItems: 'center', justifyContent: 'center' },
});
