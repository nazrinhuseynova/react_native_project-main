import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
 
interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  readOnly?: boolean;
}
 
export function StarRating({ value, onChange, max = 5, size = 28, readOnly = false }: StarRatingProps) {
  const { colors } = useTheme();
  const interactive = !readOnly && !!onChange;
 
  return (
    <View
      accessible
      accessibilityRole={interactive ? 'adjustable' : 'text'}
      accessibilityLabel={`Rating ${value} out of ${max}`}
      accessibilityValue={{ min: 0, max, now: value }}
      accessibilityActions={interactive ? [{ name: 'increment' }, { name: 'decrement' }] : undefined}
      onAccessibilityAction={(event) => {
        if (!interactive) return;
        if (event.nativeEvent.actionName === 'increment') onChange(Math.min(max, value + 1));
        if (event.nativeEvent.actionName === 'decrement') onChange(Math.max(1, value - 1));
      }}
      style={styles.row}
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= Math.round(value);
        const icon = (
          <Ionicons
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? colors.star : colors.textMuted}
          />
        );
        if (!interactive) {
          return (
            <View key={starValue} style={styles.star}>
              {icon}
            </View>
          );
        }
        return (
          <Pressable
            key={starValue}
            accessible={false}
            hitSlop={6}
            onPress={() => onChange(starValue)}
            style={styles.star}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 4 },
});
