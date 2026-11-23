import { useQueryClient } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useServices } from '@/bootstrap/useServices';

import type { AuthUser } from '../domain/entities/AuthUser';
import type { Session } from '../domain/entities/Session';
import type { AuthStateEvent } from '../domain/repositories/AuthRepository';

export type AuthContextValue = {
  isReady: boolean;
  session: Session | null;
  user: AuthUser | null;
  isRecovering: boolean;
  signOut(): Promise<void>;
  signOutAllDevices(): Promise<void>;
  beginRecovery(): void;
  cancelRecovery(): void;
  completeRecovery(): void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { auth, analytics, deviceInfo, eventBus, logger } = useServices();
  const queryClient = useQueryClient();

  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const recoveringRef = useRef(false);
  const manualSignOutRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const setRecovering = (value: boolean) => {
    recoveringRef.current = value;
    setIsRecovering(value);
  };

  useEffect(() => {
    let active = true;
    let listenerFired = false;
 const runSideEffects = (event: AuthStateEvent, next: Session) => {
      setTimeout(() => {
        void (async () => {
          try {
            if (event === 'initialSession' || event === 'signedIn') {
              await auth.devices.registerCurrent(await deviceInfo.getDeviceInfo());
            }
            await auth.biometric.syncRefreshToken(next.refreshToken);
          } catch (error) {
            logger.warn('auth.side_effects_failed', { error: String(error) });
          }
        })();
      }, 0);
    };

    const handleSignedOut = (previousUserId: string | null) => {
      const reason = manualSignOutRef.current ? 'user' : 'expired';
      manualSignOutRef.current = false;
      recoveringRef.current = false;
      setIsRecovering(false);

      analytics.setUser(null);
      queryClient.clear();
      if (previousUserId) eventBus.emit('auth.signedOut', { userId: previousUserId, reason });

      setTimeout(() => {
        auth.biometric.disable().catch(() => undefined);
      }, 0);
    };

    const unsubscribe = auth.repository.onAuthStateChange((event, next) => {
      if (!active) return;
      listenerFired = true;

      if (event === 'passwordRecovery') {
        recoveringRef.current = true;
        setIsRecovering(true);
      }

      const previousUserId = userIdRef.current;
      userIdRef.current = next?.user.id ?? null;
      setSession(next);
      setIsReady(true);

      if (event === 'signedOut') {
        handleSignedOut(previousUserId);
        return;
      }

      if (!next) return;
      runSideEffects(event, next);

      if (event === 'initialSession') analytics.setUser(next.user.id);

      if (event === 'signedIn' && next.user.id !== previousUserId && !recoveringRef.current) {
        analytics.setUser(next.user.id);
        eventBus.emit('auth.signedIn', { userId: next.user.id });
      }
    });

    auth.restoreSession
      .execute()
      .then((restored) => {
        if (!active || listenerFired) return;
        userIdRef.current = restored?.user.id ?? null;
        analytics.setUser(restored?.user.id ?? null);
        setSession(restored);
        setIsReady(true);
      })
      .catch((error: unknown) => {
        logger.warn('auth.restore_failed', { error: String(error) });
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth, analytics, deviceInfo, eventBus, logger, queryClient]);

  const signOut = async () => {
    manualSignOutRef.current = true;
    try {
      await auth.signOut.execute();
    } catch (error) {
      manualSignOutRef.current = false;
      throw error;
    }
  };

  const signOutAllDevices = async () => {
    manualSignOutRef.current = true;
    try {
      await auth.signOutAllDevices.execute();
    } catch (error) {
      manualSignOutRef.current = false;
      throw error;
    }
  };

  const completeRecovery = () => {
    setRecovering(false);
    if (session) {
      analytics.setUser(session.user.id);
      eventBus.emit('auth.signedIn', { userId: session.user.id });
    }
  };


  const visibleSession = isRecovering ? null : session;

  const value: AuthContextValue = {
    isReady,
    session: visibleSession,
    user: visibleSession?.user ?? null,
    isRecovering,
    signOut,
    signOutAllDevices,
    beginRecovery: () => setRecovering(true),
    cancelRecovery: () => setRecovering(false),
    completeRecovery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}