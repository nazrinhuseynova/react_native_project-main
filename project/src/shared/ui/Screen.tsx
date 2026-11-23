import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
 
import { useTheme } from '../theme/useTheme';
 
interface ScreenProps {
  children?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  keyboardAvoiding?: boolean;
  edges?: Edge[];
  refreshControl?: React.ReactElement<RefreshControlProps>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: ReactNode;
  footer?: ReactNode;
}
 
export function Screen({
  children,
  scroll = false,
  padded = true,
  keyboardAvoiding = false,
  edges = ['top', 'left', 'right'],
  refreshControl,
  style,
  contentContainerStyle,
  header,
  footer,
}: ScreenProps) {
  const { colors, spacing } = useTheme();
  const padding = padded ? spacing.lg : 0;
 
  const content = scroll ? (
    <ScrollView
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ padding, flexGrow: 1 }, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { padding }, contentContainerStyle]}>{children}</View>
  );
 
  const body = (
    <>
      {header}
      {content}
      {footer}
    </>
  );
 
  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.background }, style]}>
      <StatusBar style={colors.statusBar} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  flex: { flex: 1 },
});