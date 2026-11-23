import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helper?: string;
  leftIcon?: IconName;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, helper, leftIcon, rightElement, containerStyle, editable = true, onFocus, onBlur, style, ...rest },
  ref,
) {
  const { colors, radius, spacing, sizes, typography } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.inputBorder;

  return (
    <View style={containerStyle}>
      {label ? (
        <AppText variant="captionStrong" color="textSecondary" style={{ marginBottom: spacing.xs }}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.field,
          {
            minHeight: sizes.inputHeight,
            borderRadius: radius.md,
            borderColor,
            backgroundColor: editable ? colors.inputBackground : colors.disabled,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {leftIcon ? (
          <Ionicons name={leftIcon} size={sizes.iconMd} color={colors.textMuted as any} style={{ marginRight: spacing.sm }} />
        ) : null}
        <TextInput
          ref={ref as any}
          editable={editable}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          accessibilityLabel={rest.accessibilityLabel ?? label ?? rest.placeholder}
          accessibilityState={{ disabled: !editable }}
          maxFontSizeMultiplier={1.6}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, typography.body, { color: colors.text }, style]}
          {...rest}
        />
        {rightElement}
      </View>
      {error ? (
        <AppText variant="caption" color="danger" accessibilityLiveRegion="polite" style={{ marginTop: spacing.xs }}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.xs }}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  input: { flex: 1, paddingVertical: 12 },
});