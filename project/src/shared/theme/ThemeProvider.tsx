import { createContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
 
import { darkPalette, type Palette } from './palettes/dark';
import { lightPalette } from './palettes/light';
import { tokens, type Tokens } from './tokens';
 
export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeMode = 'light' | 'dark';
 
export interface Theme extends Tokens {
  mode: ThemeMode;
  isDark: boolean;
  preference: ThemePreference;
  colors: Palette;
}
 
export const ThemeContext = createContext<Theme | null>(null);
 
interface ThemeProviderProps {
  preference?: ThemePreference;
  children: ReactNode;
}
 
export function ThemeProvider({ preference = 'system', children }: ThemeProviderProps) {
  const system = useColorScheme();
 
  const mode: ThemeMode =
    preference === 'system' ? (system === 'light' ? 'light' : 'dark') : preference;
 
  const theme = useMemo<Theme>(
    () => ({
      ...tokens,
      mode,
      isDark: mode === 'dark',
      preference,
      colors: mode === 'dark' ? darkPalette : lightPalette,
    }),
    [mode, preference],
  );
 
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
