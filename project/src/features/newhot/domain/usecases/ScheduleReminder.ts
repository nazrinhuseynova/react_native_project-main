import { AppError } from '@/core/errors/AppError';
import { ValidationError } from '@/core/errors/ValidationError';
import type { NotificationScheduler } from '@/core/notifications/NotificationScheduler';

import {
  computeRemindAt,
  reminderNotificationId,
  type Reminder,
  type ReminderTarget,
} from '../entities/Reminder';
import type { ReminderRepository } from '../repositories/ReminderRepository';

export type ReminderMessage = {
  title: string;
  body: string;

  url: string;
};

export class ScheduleReminder {
  private readonly repository: ReminderRepository;
  private readonly scheduler: NotificationScheduler;

  constructor(repository: ReminderRepository, scheduler: NotificationScheduler) {
    this.repository = repository;
    this.scheduler = scheduler;
  }

  async execute(target: ReminderTarget, message: ReminderMessage): Promise<Reminder> {
    const existing = await this.repository.find(target.titleId);
    if (existing) return existing;

    const remindAt = computeRemindAt(target.releaseDate);
    if (!remindAt || !target.releaseDate) {
      throw new ValidationError('Release date is not in the future', {
        fields: { releaseDate: 'newhot.validation.notUpcoming' },
      });
    }

    await this.ensurePermission();

    const notificationId = await this.scheduler.schedule({
      id: reminderNotificationId(target.titleId),
      title: message.title,
      body: message.body,
      at: remindAt,
      data: { url: message.url, titleId: target.titleId },
    });

    try {
      return await this.repository.add({
        titleId: target.titleId,
        titleName: target.titleName,
        posterUrl: target.posterUrl,
        releaseDate: target.releaseDate,
        remindAt: remindAt.toISOString(),
        notificationId,
      });
    } catch (error) {
   
      await this.scheduler.cancel(notificationId).catch(() => undefined);
      throw error;
    }
  }

  private async ensurePermission(): Promise<void> {
    let permission = await this.scheduler.getPermission();
    if (
      permission.status === 'undetermined' ||
      (permission.status === 'denied' && permission.canAskAgain)
    ) {
      permission = await this.scheduler.requestPermission();
    }

    if (permission.status !== 'granted') {
      throw new AppError('Notification permission denied', {
        code: 'NOTIFICATION_PERMISSION',
        userMessageKey: 'newhot.permissionDenied',
      });
    }
  }
}