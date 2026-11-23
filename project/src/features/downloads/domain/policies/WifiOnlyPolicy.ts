import type { ConnectionType } from '@/core/network/NetworkMonitor';

export class WifiOnlyPolicy {
  canDownload(connection: ConnectionType, wifiOnly: boolean): boolean {
    if (connection === 'none') return false;
    if (!wifiOnly) return true;
    return connection === 'wifi';
  }
}