import * as Network from 'expo-network';

import type { ConnectionType, NetworkMonitor, NetworkStatus } from './NetworkMonitor';

function toConnectionType(type: Network.NetworkStateType | undefined): ConnectionType {
  switch (type) {
    case Network.NetworkStateType.WIFI:
    case Network.NetworkStateType.ETHERNET:
      return 'wifi';
    case Network.NetworkStateType.CELLULAR:
      return 'cellular';
    case Network.NetworkStateType.NONE:
      return 'none';
    case Network.NetworkStateType.UNKNOWN:
    case undefined:
      return 'unknown';
    default:
      return 'other';
  }
}

function toStatus(state: Network.NetworkState): NetworkStatus {
  const isConnected = state.isConnected ?? false;
  return {
    isConnected,
    isInternetReachable: state.isInternetReachable ?? isConnected,
    type: toConnectionType(state.type),
  };
}

export class ExpoNetworkMonitor implements NetworkMonitor {
  async getStatus(): Promise<NetworkStatus> {
    return toStatus(await Network.getNetworkStateAsync());
  }

  subscribe(listener: (status: NetworkStatus) => void): () => void {
    const subscription = Network.addNetworkStateListener((state) => listener(toStatus(state)));
    return () => subscription.remove();
  }
}

export const networkMonitor: NetworkMonitor = new ExpoNetworkMonitor();