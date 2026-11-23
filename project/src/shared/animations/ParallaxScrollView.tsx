import type { ReactNode } from 'react';
import { StyleSheet, View, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
 
import { useTheme } from '../theme/useTheme';
 
interface ParallaxScrollViewProps {
  header: ReactNode;
  headerHeight?: number;
  children?: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
 
export function ParallaxScrollView({
  header,
  headerHeight = 320,
  children,
  refreshControl,
  contentContainerStyle,
}: ParallaxScrollViewProps) {
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);
 
  const handler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
 
  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-headerHeight, 0, headerHeight],
          [-headerHeight / 2, 0, headerHeight * 0.4],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(scrollY.value, [-headerHeight, 0, headerHeight], [2, 1, 1], Extrapolation.CLAMP),
      },
    ],
    opacity: interpolate(scrollY.value, [0, headerHeight], [1, 0.2], Extrapolation.CLAMP),
  }));
 
  return (
    <Animated.ScrollView
      onScroll={handler}
      scrollEventThrottle={16}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={contentContainerStyle}
    >
      <Animated.View style={[{ height: headerHeight, overflow: 'hidden' }, headerStyle]}>{header}</Animated.View>
      <View style={[styles.body, { backgroundColor: colors.background }]}>{children}</View>
    </Animated.ScrollView>
  );
}
 
const styles = StyleSheet.create({
  body: { flex: 1 },
});
