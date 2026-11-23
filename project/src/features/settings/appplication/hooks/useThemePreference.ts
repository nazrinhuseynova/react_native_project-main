import type { ThemePreference } from '../../domain/entities/AppSettings';
import { useSettings } from './useSettings';

export function useThemePreference() {
  const { settings, update } = useSettings();

  return {
    preference: settings.theme,
    setPreference: (theme: ThemePreference) => update({ theme }),
  };
}