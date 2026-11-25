import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/shared/theme/useTheme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: {
  name: string;
  titleKey: string;
  icon: IconName;
}[] = [
  { name: 'home', titleKey: 'nav.tabs.home', icon: 'home' },
  { name: 'new-hot', titleKey: 'nav.tabs.newHot', icon: 'flame' },
  { name: 'search', titleKey: 'nav.tabs.search', icon: 'search' },
  { name: 'watchlist', titleKey: 'nav.tabs.myList', icon: 'bookmark' },
  { name: 'profile', titleKey: 'nav.tabs.profile', icon: 'person' },
];

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {TABS.map(({ name, titleKey, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t(titleKey),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} color={typeof color === 'string' ? color : colors.textMuted} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}