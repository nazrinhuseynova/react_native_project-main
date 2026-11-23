import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
 
import { useTheme } from '../theme/useTheme';
import { AppText } from './AppText';
 
interface OfflineBannerProps {
  visible: boolean;
  message?: string;
}
 
export function OfflineBanner({ visible, message = 'No internet connection' }: OfflineBannerProps) {
  const { colors, spacing } = useTheme();
 
  if (!visible) return null;
 
  return (
    <Animated.View
      entering={FadeInUp.duration(250)}
      exiting={FadeOutUp.duration(150)}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: colors.warning, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg }]}
    >
      <Ionicons name="cloud-offline-outline" size={16} color="#0B0B0F" style={{ marginRight: spacing.sm }} />
      <AppText variant="captionStrong" color="#0B0B0F">
        {message}
      </AppText>
    </Animated.View>
  );
}
 
const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
