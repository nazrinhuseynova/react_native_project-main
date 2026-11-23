import { useCallback, useEffect, useRef, useState } from 'react';
 
export function useCountdown(initialSeconds: number, autoStart = false) {
  const [remaining, setRemaining] = useState(autoStart ? initialSeconds : 0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
 
  const start = useCallback(
    (seconds: number = initialSeconds) => {
      clear();
      setRemaining(seconds);
      setIsRunning(seconds > 0);
    },
    [clear, initialSeconds],
  );
 
  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);
 
  const reset = useCallback(() => {
    clear();
    setRemaining(0);
    setIsRunning(false);
  }, [clear]);
 
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          clear();
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning, clear]);
 
  return { remaining, isRunning, isFinished: !isRunning && remaining === 0, start, stop, reset };
}
