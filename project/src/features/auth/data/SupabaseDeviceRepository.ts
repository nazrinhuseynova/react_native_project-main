import type { SupabaseClient } from '@supabase/supabase-js';

import { AppError } from '@/core/errors/AppError';
import type { DeviceInfo, DevicePlatform } from '@/core/device/DeviceInfoProvider';

import type { Device } from '../domain/entities/Device';
import type { DeviceRepository } from '../domain/repositories/DeviceRepository';

const TABLE = 'devices';

type DeviceRow = {
  id: string;
  name: string;
  platform: string;
  os_version: string | null;
  model: string | null;
  last_active_at: string;
};

function toDevice(row: DeviceRow, currentDeviceId: string): Device {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform as DevicePlatform,
    osVersion: row.os_version,
    model: row.model,
    lastActiveAt: row.last_active_at,
    isCurrent: row.id === currentDeviceId,
  };
}

function toError(message: string, cause: unknown): AppError {
  return new AppError(message, { code: 'DEVICE', userMessageKey: 'errors.unknown', cause });
}

export class SupabaseDeviceRepository implements DeviceRepository {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async list(currentDeviceId: string): Promise<Device[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('id,name,platform,os_version,model,last_active_at')
      .order('last_active_at', { ascending: false });

    if (error) throw toError('Failed to load devices', error);
    return ((data ?? []) as DeviceRow[]).map((row) => toDevice(row, currentDeviceId));
  }

  async registerCurrent(info: DeviceInfo): Promise<void> {
    const { error } = await this.client.from(TABLE).upsert(
      {
        id: info.id,
        name: info.name,
        platform: info.platform,
        os_version: info.osVersion,
        model: info.model,
        last_active_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,id' },
    );
    if (error) throw toError('Failed to register device', error);
  }

  async remove(deviceId: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('id', deviceId);
    if (error) throw toError('Failed to remove device', error);
  }
}