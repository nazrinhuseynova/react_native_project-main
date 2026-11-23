import * as Device from 'expo-device';

import type { SecureStorage } from '@/core/storage/SecureStorage';
import { storageKeys } from '@/core/storage/storageKeys';
import { createId } from '@/core/utils/createId';

import type { DeviceInfo, DeviceInfoProvider, DevicePlatform } from './DeviceInfoProvider';

function toPlatform(osName: string | null): DevicePlatform {
  switch (osName?.toLowerCase()) {
    case 'android':
      return 'android';
    case 'ios':
    case 'ipados':
      return 'ios';
    case 'windows':
    case 'macos':
    case 'linux':
      return 'web';
    default:
      return 'unknown';
  }
}

export class ExpoDeviceInfoProvider implements DeviceInfoProvider {
  private readonly storage: SecureStorage;
  private cached: Promise<DeviceInfo> | null = null;

  constructor(storage: SecureStorage) {
    this.storage = storage;
  }

  getDeviceInfo(): Promise<DeviceInfo> {
    if (!this.cached) {
      this.cached = this.load();
    }
    return this.cached;
  }

  private async load(): Promise<DeviceInfo> {
    return {
      id: await this.getOrCreateId(),
      name: Device.deviceName ?? Device.modelName ?? 'Unknown device',
      platform: toPlatform(Device.osName),
      osVersion: Device.osVersion,
      model: Device.modelName,
      isPhysicalDevice: Device.isDevice,
    };
  }

  private async getOrCreateId(): Promise<string> {
    const existing = await this.storage.getString(storageKeys.deviceId);
    if (existing) return existing;

    const created = createId();
    await this.storage.setString(storageKeys.deviceId, created);
    return created;
  }
}