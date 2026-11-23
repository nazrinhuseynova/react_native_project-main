import type { DevicePlatform } from '@/core/device/DeviceInfoProvider';

export type Device = {
  id: string;
  name: string;
  platform: DevicePlatform;
  osVersion: string | null;
  model: string | null;
  lastActiveAt: string;
  isCurrent: boolean;
};