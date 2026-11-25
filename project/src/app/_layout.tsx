import { Stack, useRouter, useSegments, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/bootstrap/AppProviders';
import { useAppGate, type AppStage } from '@/bootstrap/useAppGate';

SplashScreen.preventAutoHideAsync();

const STAGE_ROUTE: Record<AppStage, Href> = {
  onboarding: '/splash',
  auth: '/login',
  profiles: '/who-is-watching',
  app: '/home',
};

function RootNavigator() {
  const { isReady, stage } = useAppGate();
  const segments = useSegments();
  const router = useRouter();
  const lastRedirectStage = useRef<AppStage | null>(null);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    console.log('[GATE]', { isReady, stage, topSegment: segments.at(0) });
    if (!isReady) return;

    const topSegment = segments.at(0);

    if (lastRedirectStage.current === stage && topSegment) {
      return;
    }

    if (stage === 'onboarding' && topSegment !== '(onboarding)') {
      lastRedirectStage.current = stage;
      router.replace(STAGE_ROUTE.onboarding);
    } else if (stage === 'auth' && topSegment !== '(auth)') {
      lastRedirectStage.current = stage;
      router.replace(STAGE_ROUTE.auth);
    } else if (stage === 'profiles' && topSegment !== '(profiles)') {
      lastRedirectStage.current = stage;
      router.replace(STAGE_ROUTE.profiles);
    } else if (
      stage === 'app' &&
      (topSegment === '(onboarding)' ||
        topSegment === '(auth)' ||
        topSegment === '(profiles)' ||
        !topSegment)
    ) {
      lastRedirectStage.current = stage;
      router.replace(STAGE_ROUTE.app);
    }
  }, [isReady, stage, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(profiles)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="movie/[id]/index" />
      <Stack.Screen name="movie/[id]/reviews" />
      <Stack.Screen name="movie/[id]/edit-review" />
      <Stack.Screen name="person/[id]" />
      <Stack.Screen name="genre/[id]" />
      <Stack.Screen name="player/[id]" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="account/index" />
      <Stack.Screen name="account/change-password" />
      <Stack.Screen name="account/change-email" />
      <Stack.Screen name="account/devices" />
      <Stack.Screen name="account/delete" />
      <Stack.Screen name="account/security" />
      <Stack.Screen name="billing/plans" />
      <Stack.Screen name="billing/checkout" />
      <Stack.Screen name="billing/payment-methods" />
      <Stack.Screen name="billing/history" />
      <Stack.Screen name="billing/(rent)/[id]" />
      <Stack.Screen name="parental/index" />
      <Stack.Screen name="parental/blocked-titles" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
