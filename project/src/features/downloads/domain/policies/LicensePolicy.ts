import { DOWNLOAD_LICENSE_CHECK_DAYS } from '@/core/config/constants';

import type { DownloadItem } from '../entities/DownloadItem';

export type LicenseState = 'valid' | 'needs_check' | 'expired';

const DAY_MS = 24 * 60 * 60 * 1000;
const LICENSE_VALID_DAYS = 30;
const OFFLINE_GRACE_DAYS = 3;

export class LicensePolicy {
  expiryFor(now: number): number {
    return now + LICENSE_VALID_DAYS * DAY_MS;
  }

  evaluate(item: DownloadItem, now: number): LicenseState {
    if (item.status !== 'completed') return 'valid';
    if (item.expiresAt !== null && now >= item.expiresAt) return 'expired';
    const lastCheck = item.lastLicenseCheckAt ?? item.createdAt;
    return now - lastCheck >= DOWNLOAD_LICENSE_CHECK_DAYS * DAY_MS ? 'needs_check' : 'valid';
  }

  /** İnternet olmadan oynatmaq olar? (yoxlama müddəti + güzəşt keçibsə, yox) */
  canPlayOffline(item: DownloadItem, now: number): boolean {
    if (item.status !== 'completed' || !item.fileUri) return false;
    const state = this.evaluate(item, now);
    if (state === 'expired') return false;
    if (state === 'valid') return true;
    const lastCheck = item.lastLicenseCheckAt ?? item.createdAt;
    return now - lastCheck < (DOWNLOAD_LICENSE_CHECK_DAYS + OFFLINE_GRACE_DAYS) * DAY_MS;
  }
}