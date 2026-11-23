import type { DeviceInfoProvider } from '@/core/device/DeviceInfoProvider';
import { AppError } from '@/core/errors/AppError';
import type { DeviceRepository } from '@/features/auth';

export class RevokeDevice {
  private readonly devices: DeviceRepository;
  private readonly deviceInfo: DeviceInfoProvider;

  constructor(devices: DeviceRepository, deviceInfo: DeviceInfoProvider) {
    this.devices = devices;
    this.deviceInfo = deviceInfo;
  }

  async execute(deviceId: string): Promise<void> {
    const current = await this.deviceInfo.getDeviceInfo();
    if (current.id === deviceId) {
      throw new AppError('Cannot remove the current device', {
        code: 'DEVICE_CURRENT',
        userMessageKey: 'account.errors.revokeCurrent',
      });
    }
    await this.devices.remove(deviceId);
  }
}