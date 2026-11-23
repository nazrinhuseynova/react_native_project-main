import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_HIDE_MS = 3500;

/** pinned=true olanda (məs. pauza) idarə düymələri gizlənmir. */
export function useControlsVisibility(pinned: boolean, autoHideMs = DEFAULT_HIDE_MS) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(false), autoHideMs);
  }, [autoHideMs, clearTimer]);

  const show = useCallback(() => {
    setVisible(true);
    if (!pinned) scheduleHide();
  }, [pinned, scheduleHide]);

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (visible) hide();
    else show();
  }, [visible, hide, show]);

  useEffect(() => {
    if (pinned) {
      clearTimer();
      setVisible(true);
    } else if (visible) {
      scheduleHide();
    }
    return clearTimer;
  }, [pinned, visible, scheduleHide, clearTimer]);

  return { visible, show, hide, toggle };
}