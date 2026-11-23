import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { buttonA11y, headerA11y } from '../a11y/accessibilityProps';
import { ScalePressable } from '../animations/ScalePressable';
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  onBack,
  backLabel = 'Back',
  rightElement,
  style,
}: ScreenHeaderProps) {
  const { spacing, colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomColor: colors.border,
        },
        style,
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <ScalePressable
            {...buttonA11y(backLabel)}
            onPress={onBack}
            hitSlop={10}
            style={[styles.backButton, { marginRight: spacing.xs }]}
          >
            <AppText variant="body" color="primary" weight="600">
              ←
            </AppText>
          </ScalePressable>
        ) : null}
      </View>

      <AppText
        variant="headline"
        numberOfLines={1}
        {...headerA11y(title)}
        style={styles.title}
      >
        {title}
      </AppText>

      <View style={[styles.side, styles.rightSide]}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: {
    minWidth: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSide: {
    justifyContent: 'flex-end',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});