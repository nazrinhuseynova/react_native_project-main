import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
 
import { alertA11y } from '../a11y/accessibilityProps';
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';
 
export type ToastType = 'info' | 'success' | 'error' | 'warning';
 
export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}
 
interface ToastProps {
  toast: ToastMessage;
}
 
const ICONS: Record<ToastType, IconName> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
};
 
export function Toast({ toast }: ToastProps) {
  const { colors, radius, spacing, elevation } = useTheme();
  const insets = useSafeAreaInsets();
 
  const accent = {
    info: colors.info,
    success: colors.success,
    error: colors.danger,
    warning: colors.warning,
  }[toast.type];
 
  return (
    <View pointerEvents="none" style={[styles.wrapper, { top: insets.top + spacing.sm, paddingHorizontal: spacing.lg }]}>
      <Animated.View
        key={toast.id}
        entering={FadeInUp.duration(250)}
        exiting={FadeOutUp.duration(200)}
        {...alertA11y(toast.message)}
        style={[
          styles.toast,
          elevation.md,
          {
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.md,
            borderLeftColor: accent,
            padding: spacing.md,
          },
        ]}
      >
        <Ionicons name={ICONS[toast.type]} size={22} color={accent} style={{ marginRight: spacing.md }} />
        <AppText variant="callout" style={{ flex: 1 }}>
          {toast.message}
        </AppText>
      </Animated.View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 1000 },
  toast: { flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 480, borderLeftWidth: 4 },
});
