import type { TitleId } from '@/features/catalog';
import type { NotificationScheduler } from '@/core/notifications/NotificationScheduler';

import { reminderNotificationId } from '../entities/Reminder';
import type { ReminderRepository } from '../repositories/ReminderRepository';

export class CancelReminder {
  private readonly repository: ReminderRepository;
  private readonly scheduler: NotificationScheduler;

  constructor(repository: ReminderRepository, scheduler: NotificationScheduler) {
    this.repository = repository;
    this.scheduler = scheduler;
  }

  async execute(titleId: TitleId): Promise<void> {
    const existing = await this.repository.find(titleId);
    const notificationId = existing?.notificationId ?? reminderNotificationId(titleId);

    await this.scheduler.cancel(notificationId).catch(() => undefined);
    if (existing) await this.repository.remove(titleId);
  }
}