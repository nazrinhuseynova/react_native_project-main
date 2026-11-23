import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useReduceMotion } from '@/shared/a11y/useReduceMotion';
import { Screen } from '@/shared/ui/Screen';

import { LogoAnimation } from '../components/LogoAnimation';

const SPLASH_MS = 2200;
const SPLASH_REDUCED_MS = 600;

export function SplashScreen() {
  const router = useRouter();
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const timer = setTimeout(
      () => router.replace('/intro'),
      reduceMotion ? SPLASH_REDUCED_MS : SPLASH_MS,
    );
    return () => clearTimeout(timer);
  }, [router, reduceMotion]);

  return (
    <Screen
      padded={false}
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <LogoAnimation />
    </Screen>
  );
}