import type { DeviceInfo } from '@/core/device/DeviceInfoProvider';

import type { Device } from '../entities/Device';

export interface DeviceRepository {
  list(currentDeviceId: string): Promise<Device[]>;
  registerCurrent(info: DeviceInfo): Promise<void>;
  remove(deviceId: string): Promise<void>;
}