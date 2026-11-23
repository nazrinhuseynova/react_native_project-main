import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useAppState(onChange?: (state: AppStateStatus, previous: AppStateStatus) => void) {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState as AppStateStatus);
  const previousRef = useRef<AppStateStatus>(AppState.currentState as AppStateStatus);
  const onChangeRef = useRef<typeof onChange>(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      const previous = previousRef.current;
      previousRef.current = next;
      setAppState(next);
      onChangeRef.current?.(next, previous);
    });
    return () => subscription.remove();
  }, []);

  return appState;
}