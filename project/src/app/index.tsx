import { Redirect, type Href } from 'expo-router';

import { useAppGate, type AppStage } from '@/bootstrap/useAppGate';

const ENTRY_ROUTE: Record<AppStage, Href> = {
  onboarding: '/splash',
  auth: '/login',
  profiles: '/who-is-watching',
  app: '/home',
};

export default function Index() {
  const { stage } = useAppGate();
  return <Redirect href={ENTRY_ROUTE[stage]} />;
}