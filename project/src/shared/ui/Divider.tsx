import { View, type StyleProp, type ViewStyle } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
 
interface DividerProps {
  vertical?: boolean;
  inset?: number;
  style?: StyleProp<ViewStyle>;
}
 
export function Divider({ vertical = false, inset = 0, style }: DividerProps) {
  const { colors } = useTheme();
 
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        vertical
          ? { width: 1, alignSelf: 'stretch', marginVertical: inset }
          : { height: 1, alignSelf: 'stretch', marginLeft: inset },
        { backgroundColor: colors.divider },
        style,
      ]}
    />
  );
}
