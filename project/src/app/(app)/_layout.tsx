import { Drawer } from 'expo-router/drawer';

export default function AppDrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ title: 'Home' }} />
      <Drawer.Screen name="watched" options={{ title: 'Watched Movies' }} />
      <Drawer.Screen name="downloads" options={{ title: 'Downloads' }} />
      <Drawer.Screen name="subscription" options={{ title: 'Subscription' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
    </Drawer>
  );
}