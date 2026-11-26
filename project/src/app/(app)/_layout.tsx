import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/shared/theme/useTheme';

export default function AppDrawerLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primarySoft,
        drawerLabelStyle: { fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: t('nav.home') }} />
      <Drawer.Screen name="watched" options={{ title: t('nav.watched'), headerShown: false }} />
      <Drawer.Screen name="downloads" options={{ title: t('nav.downloads'), headerShown: false }} />
      <Drawer.Screen name="subscription" options={{ title: t('nav.subscription') }} />
      <Drawer.Screen name="settings" options={{ title: t('nav.settings') }} />
    </Drawer>
  );
}