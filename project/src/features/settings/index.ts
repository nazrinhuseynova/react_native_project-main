export { SettingsScreen } from './presentation/screens/SettingsScreen';
export { SettingsProvider } from './appplication/SettingsProvider';
export { useSettings } from './appplication/hooks/useSettings';
export { useThemePreference } from './appplication/hooks/useThemePreference';
export { useDataSaver } from './appplication/hooks/useDataSaver';
export type { AppSettings, ThemePreference } from './domain/entities/AppSettings';
export type { SettingsRepository } from './domain/repositories/SettingsRepository';


export { AsyncSettingsRepository } from './data/AsyncSettingsRepository';
export { createSettingsSectionRegistry } from './appplication/settingsSectionRegistry';