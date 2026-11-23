import type { DeviceInfoProvider } from '@/core/device/DeviceInfoProvider';
import type { Device, DeviceRepository } from '@/features/auth';

export class ListDevices {
  private readonly devices: DeviceRepository;
  private readonly deviceInfo: DeviceInfoProvider;

  constructor(devices: DeviceRepository, deviceInfo: DeviceInfoProvider) {
    this.devices = devices;
    this.deviceInfo = deviceInfo;
  }

  async execute(): Promise<Device[]> {
    const current = await this.deviceInfo.getDeviceInfo();
    return this.devices.list(current.id);
  }
}