export type DevicePlatform = 'android' | 'ios' | 'web' | 'unknown';

export type DeviceInfo = {
  id: string;
  name: string;
  platform: DevicePlatform;
  osVersion: string | null;
  model: string | null;
  isPhysicalDevice: boolean;
};

export interface DeviceInfoProvider {
  getDeviceInfo(): Promise<DeviceInfo>;
}