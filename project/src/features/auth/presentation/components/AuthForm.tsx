import { type ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { type Control, type FieldValues, type Path, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export const authPalette = {
  background: '#0B0B0F',
  surface: '#1A1A22',
  border: '#2C2C36',
  text: '#FFFFFF',
  muted: '#9A9AA5',
  primary: '#E50914',
  danger: '#FF5A5F',
  info: '#4DA3FF',
} as const;

type AuthFormProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthForm({ title, subtitle, children, footer }: AuthFormProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.fields}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthFieldProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur' | 'secureTextEntry'
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  secure?: boolean;
};

export function AuthField<T extends FieldValues>({
  control,
  name,
  label,
  secure = false,
  ...inputProps
}: AuthFieldProps<T>) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name });
  const [hidden, setHidden] = useState(secure);
  const message = fieldState.error?.message;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, message ? styles.inputError : null]}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={authPalette.muted}
          {...inputProps}
          style={styles.input}
          value={String(field.value ?? '')}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          secureTextEntry={hidden}
          accessibilityLabel={label}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.toggle}>{hidden ? t('auth.field.show') : t('auth.field.hide')}</Text>
          </Pressable>
        ) : null}
      </View>
      {message ? <Text style={styles.error}>{t(message)}</Text> : null}
    </View>
  );
}

type AuthCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  length: number;
  editable?: boolean;
  label?: string;
};

export function AuthCodeInput({ value, onChange, length, editable = true, label }: AuthCodeInputProps) {
  return (
    <TextInput
      style={styles.code}
      value={value}
      onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
      keyboardType="number-pad"
      maxLength={length}
      editable={editable}
      autoFocus
      textContentType="oneTimeCode"
      autoComplete="one-time-code"
      placeholder={'•'.repeat(length)}
      placeholderTextColor={authPalette.border}
      accessibilityLabel={label}
    />
  );
}

type AuthButtonProps = {
  label: string;
  onPress: () => unknown;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function AuthButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AuthButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={() => {
        void onPress();
      }}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        inactive ? styles.buttonDisabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={authPalette.text} />
      ) : (
        <Text style={styles.buttonLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

type AuthLinkProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthLink({ label, onPress, disabled = false }: AuthLinkProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="link" hitSlop={8}>
      <Text style={[styles.link, disabled ? styles.linkDisabled : null]}>{label}</Text>
    </Pressable>
  );
}

type AuthMessageProps = {
  message: string;
  tone?: 'error' | 'info';
};

export function AuthMessage({ message, tone = 'error' }: AuthMessageProps) {
  return (
    <View style={[styles.message, tone === 'error' ? styles.messageError : styles.messageInfo]}>
      <Text style={styles.messageText} accessibilityLiveRegion="polite">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: authPalette.background },
  content: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 8 },
  title: { color: authPalette.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: authPalette.muted, fontSize: 16, marginBottom: 8 },
  fields: { gap: 16, marginTop: 16 },
  footer: { marginTop: 24, alignItems: 'center', gap: 12 },
  field: { gap: 6 },
  label: { color: authPalette.muted, fontSize: 13, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: authPalette.surface,
    borderColor: authPalette.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  inputError: { borderColor: authPalette.danger },
  input: { flex: 1, color: authPalette.text, fontSize: 16, paddingVertical: 14 },
  toggle: { color: authPalette.muted, fontSize: 13, fontWeight: '600' },
  error: { color: authPalette.danger, fontSize: 12 },
  code: {
    backgroundColor: authPalette.surface,
    borderColor: authPalette.border,
    borderWidth: 1,
    borderRadius: 10,
    color: authPalette.text,
    fontSize: 28,
    letterSpacing: 10,
    textAlign: 'center',
    paddingVertical: 16,
  },
  button: {
    minHeight: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonPrimary: { backgroundColor: authPalette.primary },
  buttonSecondary: {
    backgroundColor: authPalette.surface,
    borderColor: authPalette.border,
    borderWidth: 1,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { color: authPalette.text, fontSize: 16, fontWeight: '700' },
  link: { color: authPalette.text, fontSize: 14, fontWeight: '600' },
  linkDisabled: { color: authPalette.muted },
  message: { borderRadius: 10, padding: 12 },
  messageError: { backgroundColor: 'rgba(255, 90, 95, 0.15)' },
  messageInfo: { backgroundColor: 'rgba(77, 163, 255, 0.15)' },
  messageText: { color: authPalette.text, fontSize: 14 },
});