export type ConnectionType = 'wifi' | 'cellular' | 'other' | 'none' | 'unknown';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: ConnectionType;
};

export interface NetworkMonitor {
  getStatus(): Promise<NetworkStatus>;
  subscribe(listener: (status: NetworkStatus) => void): () => void;
}