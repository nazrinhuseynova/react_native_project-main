import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
 
export function useBackHandler(handler: () => boolean, enabled = true) {
  const handlerRef = useRef(handler);
 
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
 
  useEffect(() => {
    if (!enabled) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => handlerRef.current());
    return () => subscription.remove();
  }, [enabled]);
}
