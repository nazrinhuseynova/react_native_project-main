import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
 
import { buttonA11y, headerA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}
 
export function SectionHeader({ title, actionLabel, onAction, style }: SectionHeaderProps) {
  const { spacing } = useTheme();
 
  return (
    <View style={[styles.row, { marginBottom: spacing.md }, style]}>
      <AppText variant="title3" {...headerA11y(title)} style={{ flex: 1 }}>
        {title}
      </AppText>
      {actionLabel && onAction ? (
        <ScalePressable {...buttonA11y(actionLabel)} onPress={onAction} hitSlop={8}>
          <AppText variant="callout" color="primary" weight="600">
            {actionLabel}
          </AppText>
        </ScalePressable>
      ) : null}
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
