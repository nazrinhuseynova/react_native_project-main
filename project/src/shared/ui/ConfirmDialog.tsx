import { Modal, Pressable, StyleSheet, View } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
import { Button } from './Button';
 
interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
 
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors, radius, spacing } = useTheme();
 
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={[styles.root, { backgroundColor: colors.scrim, padding: spacing.xl }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          style={StyleSheet.absoluteFill}
          onPress={loading ? undefined : onCancel}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.dialog,
            { backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, padding: spacing.xl },
          ]}
        >
          <AppText variant="title3" accessibilityRole="header">
            {title}
          </AppText>
          {message ? (
            <AppText variant="body" color="textSecondary" style={{ marginTop: spacing.sm }}>
              {message}
            </AppText>
          ) : null}
          <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              loading={loading}
              onPress={onConfirm}
            />
            <Button label={cancelLabel} variant="ghost" disabled={loading} onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
 
const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dialog: { width: '100%', maxWidth: 420 },
});
