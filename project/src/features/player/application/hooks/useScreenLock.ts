import { useCallback, useState } from 'react';

export function useScreenLock() {
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => setIsLocked(true), []);
  const unlock = useCallback(() => setIsLocked(false), []);
  const toggle = useCallback(() => setIsLocked((value) => !value), []);

  return { isLocked, lock, unlock, toggle };
}