import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  error?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  error,
  autoFocus = true,
  disabled = false,
}: OtpInputProps) {
  const { colors, radius, spacing, typography } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value.length === length) onComplete?.(value);
  }, [value, length, onComplete]);

  const handleChange = (text: string) => {
    onChange(text.replace(/\D/g, '').slice(0, length));
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <Pressable
        accessible
        accessibilityRole="none"
        accessibilityLabel={`Verification code, ${value.length} of ${length} digits entered`}
        onPress={() => (inputRef.current as any)?.focus()}
        style={styles.row}
      >
        {Array.from({ length }).map((_, index) => {
          const char = value[index] ?? '';
          const isActive = focused && index === activeIndex;
          return (
            <View
              key={index}
              style={[
                styles.cell,
                {
                  borderRadius: radius.md,
                  backgroundColor: colors.inputBackground,
                  borderColor: (error ? colors.danger : isActive ? colors.primary : colors.inputBorder) as any,
                },
              ]}
            >
              <AppText variant="title2" align="center">
                {char}
              </AppText>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef as any}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        caretHidden
        style={[styles.hidden, typography.body]}
      />
      {error ? (
        <AppText variant="caption" color="danger" align="center" style={{ marginTop: spacing.sm }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cell: { flex: 1, height: 56, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});