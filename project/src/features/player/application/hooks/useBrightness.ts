import * as Brightness from 'expo-brightness';
import { useCallback, useEffect, useRef } from 'react';

import { clamp } from '@/core/utils/clamp';

export function useBrightness() {
  const valueRef = useRef(0.5);
  const originalRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    Brightness.getBrightnessAsync()
      .then((value) => {
        if (!active) return;
        valueRef.current = value;
        originalRef.current = value;
      })
      .catch(() => undefined);

    return () => {
      active = false;
      if (originalRef.current !== null) {
        Brightness.setBrightnessAsync(originalRef.current).catch(() => undefined);
      }
    };
  }, []);

  const getBrightness = useCallback(() => valueRef.current, []);

  const setBrightness = useCallback((value: number) => {
    const next = clamp(value, 0, 1);
    valueRef.current = next;
    Brightness.setBrightnessAsync(next).catch(() => undefined);
  }, []);

  return { getBrightness, setBrightness };
}