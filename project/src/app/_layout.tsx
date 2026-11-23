import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/bootstrap/AppProviders';
import { useAppGate } from '@/bootstrap/useAppGate';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isReady, stage } = useAppGate();

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={stage === 'onboarding'}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={stage === 'auth'}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={stage === 'profiles'}>
        <Stack.Screen name="(profiles)" />
      </Stack.Protected>

      <Stack.Protected guard={stage === 'app'}>
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
        <Stack.Screen name="billing/rent/[id]" />
        <Stack.Screen name="parental/index" />
        <Stack.Screen name="parental/blocked-titles" />
      </Stack.Protected>
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