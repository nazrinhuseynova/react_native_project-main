import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'new-hot', title: 'New & Hot', icon: 'flame' },
  { name: 'search', title: 'Search', icon: 'search' },
  { name: 'watchlist', title: 'Watchlist', icon: 'bookmark' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {TABS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
            <Ionicons name={icon} color={color as any} size={size} />),
          }}
        />
      ))}
    </Tabs>
  );
}