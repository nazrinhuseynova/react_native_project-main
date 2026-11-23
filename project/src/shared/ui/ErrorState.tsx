import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
 
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
import { Button } from './Button';
 
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}
 
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  const { colors, spacing } = useTheme();
 
  return (
    <View accessibilityRole="alert" style={[styles.container, { padding: spacing.xxl }]}>
      <Ionicons name="alert-circle-outline" size={56} color={colors.danger} />
      <AppText variant="title3" align="center" style={{ marginTop: spacing.lg }}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="callout" color="textSecondary" align="center" style={{ marginTop: spacing.sm }}>
          {message}
        </AppText>
      ) : null}
      {onRetry ? (
        <Button
          label={retryLabel}
          onPress={onRetry}
          leftIcon="refresh"
          fullWidth={false}
          style={{ marginTop: spacing.xl }}
        />
      ) : null}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
