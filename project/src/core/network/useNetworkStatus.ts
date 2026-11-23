import { useSyncExternalStore } from 'react';

import { networkMonitor } from './ExpoNetworkMonitor';
import type { NetworkStatus } from './NetworkMonitor';

const listeners = new Set<() => void>();
let snapshot: NetworkStatus = { isConnected: true, isInternetReachable: true, type: 'unknown' };
let unsubscribeMonitor: (() => void) | null = null;

function isSame(a: NetworkStatus, b: NetworkStatus): boolean {
  return (
    a.isConnected === b.isConnected &&
    a.isInternetReachable === b.isInternetReachable &&
    a.type === b.type
  );
}

function publish(next: NetworkStatus): void {
  if (isSame(snapshot, next)) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (listeners.size === 1) {
    networkMonitor
      .getStatus()
      .then(publish)
      .catch(() => undefined);
    unsubscribeMonitor = networkMonitor.subscribe(publish);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && unsubscribeMonitor) {
      unsubscribeMonitor();
      unsubscribeMonitor = null;
    }
  };
}

function getSnapshot(): NetworkStatus {
  return snapshot;
}

export function useNetworkStatus() {
  const status = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...status,
    isOffline: !status.isInternetReachable,
    isCellular: status.type === 'cellular',
    isWifi: status.type === 'wifi',
  };
}