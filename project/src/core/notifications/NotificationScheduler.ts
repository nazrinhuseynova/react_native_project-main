export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type NotificationPermission = {
  status: NotificationPermissionStatus;
  canAskAgain: boolean;
};

export type ScheduledNotificationInput = {
  id?: string;
  title: string;
  body: string;
  at: Date;
  data?: Record<string, unknown>;
};

export interface NotificationScheduler {
  schedule(input: ScheduledNotificationInput): Promise<string>;
  cancel(id: string): Promise<void>;
  cancelAll(): Promise<void>;
  getPermission(): Promise<NotificationPermission>;
  requestPermission(): Promise<NotificationPermission>;
}