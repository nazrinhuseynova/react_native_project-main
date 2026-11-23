import { StyleSheet, View } from 'react-native';
 
import { tabA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}
 
interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
}
 
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors, radius } = useTheme();
 
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.container, { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: colors.border }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <ScalePressable
            key={option.value}
            {...tabA11y(option.label, selected)}
            onPress={() => onChange(option.value)}
            scaleTo={0.97}
            style={[
              styles.segment,
              { borderRadius: radius.md - 2, backgroundColor: selected ? colors.primary : 'transparent' },
            ]}
          >
            <AppText variant="bodyStrong" color={selected ? 'textOnPrimary' : 'textSecondary'} numberOfLines={1}>
              {option.label}
            </AppText>
          </ScalePressable>
        );
      })}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 3, borderWidth: 1 },
  segment: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
});
