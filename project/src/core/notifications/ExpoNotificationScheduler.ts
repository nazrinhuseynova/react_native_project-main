import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { NOTIFICATION_CHANNEL_ID } from '@/core/config/constants';

import type {
  NotificationPermission,
  NotificationPermissionStatus,
  NotificationScheduler,
  ScheduledNotificationInput,
} from './NotificationScheduler';

function toStatus(status: Notifications.PermissionStatus): NotificationPermissionStatus {
  switch (status) {
    case Notifications.PermissionStatus.GRANTED:
      return 'granted';
    case Notifications.PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
}

function toPermission(response: Notifications.NotificationPermissionsStatus): NotificationPermission {
  return { status: toStatus(response.status), canAskAgain: response.canAskAgain };
}

export class ExpoNotificationScheduler implements NotificationScheduler {
  private channelReady = false;

  async schedule(input: ScheduledNotificationInput): Promise<string> {
    await this.ensureChannel();

    const secondsUntil = Math.ceil((input.at.getTime() - Date.now()) / 1000);
    const trigger: Notifications.NotificationTriggerInput =
      secondsUntil <= 1
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
            channelId: NOTIFICATION_CHANNEL_ID,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: input.at,
            channelId: NOTIFICATION_CHANNEL_ID,
          };

    return Notifications.scheduleNotificationAsync({
      identifier: input.id,
      content: {
        title: input.title,
        body: input.body,
        data: input.data ?? {},
      },
      trigger,
    });
  }

  async cancel(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getPermission(): Promise<NotificationPermission> {
    return toPermission(await Notifications.getPermissionsAsync());
  }

  async requestPermission(): Promise<NotificationPermission> {
    await this.ensureChannel();
    return toPermission(await Notifications.requestPermissionsAsync());
  }

  private async ensureChannel(): Promise<void> {
    if (Platform.OS !== 'android' || this.channelReady) return;

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'General',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    this.channelReady = true;
  }
}