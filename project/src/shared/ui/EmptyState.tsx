import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
import type { IconName } from '../types/common';
import { AppText } from './AppText';
import { Button } from './Button';
 
interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}
 
export function EmptyState({ title, message, icon = 'film-outline', actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing } = useTheme();
 
  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <Ionicons name={icon} size={56} color={colors.textMuted} />
      <AppText variant="title3" align="center" style={{ marginTop: spacing.lg }}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="callout" color="textSecondary" align="center" style={{ marginTop: spacing.sm }}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          fullWidth={false}
          variant="secondary"
          style={{ marginTop: spacing.xl }}
        />
      ) : null}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
