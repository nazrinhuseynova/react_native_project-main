import type { ComponentType } from 'react';

import { Registry } from '@/core/registry/Registry';

import { AboutSection } from '../presentation/components/sections/AboutSection';
import { AppearanceSection } from '../presentation/components/sections/AppearanceSection';
import { DownloadsSection } from '../presentation/components/sections/DownloadsSection';
import { LanguageSection } from '../presentation/components/sections/LanguageSection';
import { NotificationsSection } from '../presentation/components/sections/NotificationsSection';
import { PlaybackSection } from '../presentation/components/sections/PlaybackSection';
import { PrivacySection } from '../presentation/components/sections/PrivacySection';

export type SettingsSection = {
  readonly id: string;
  readonly order: number;
  readonly Component: ComponentType;
};


export function createSettingsSectionRegistry(): Registry<SettingsSection> {
  return new Registry<SettingsSection>().registerAll([
    { id: 'appearance', order: 0, Component: AppearanceSection },
    { id: 'language', order: 1, Component: LanguageSection },
    { id: 'notifications', order: 2, Component: NotificationsSection },
    { id: 'playback', order: 3, Component: PlaybackSection },
    { id: 'downloads', order: 4, Component: DownloadsSection },
    { id: 'privacy', order: 5, Component: PrivacySection },
    { id: 'about', order: 6, Component: AboutSection },
  ]);
}