import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import type { Theme } from './ThemeProvider';
import { useTheme } from './useTheme';

export function makeStyles<T extends Record<string, any>>(
  factory: (theme: Theme) => T,
): () => T {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme) as any) as T, [theme]);
  };
}