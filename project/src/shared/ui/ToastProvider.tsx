import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
 
import { Toast, type ToastMessage, type ToastType } from './Toast';
 
interface ShowToastOptions {
  type?: ToastType;
  duration?: number;
}
 
interface ToastApi {
  show: (message: string, options?: ShowToastOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  hide: () => void;
}
 
const ToastContext = createContext<ToastApi | null>(null);
 
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef(0);
 
  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);
 
  const show = useCallback(
    (message: string, options: ShowToastOptions = {}) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      counterRef.current += 1;
      const duration = options.duration ?? 3000;
      setToast({ id: counterRef.current, message, type: options.type ?? 'info', duration });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [],
  );
 
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
 
  const api = useMemo<ToastApi>(
    () => ({
      show,
      hide,
      success: (message) => show(message, { type: 'success' }),
      error: (message) => show(message, { type: 'error', duration: 4000 }),
      info: (message) => show(message, { type: 'info' }),
      warning: (message) => show(message, { type: 'warning' }),
    }),
    [show, hide],
  );
 
  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? <Toast toast={toast} /> : null}
    </ToastContext.Provider>
  );
}
 
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
