import type { DownloadEngine } from '../ports/DownloadEngine';
import type { LicensePolicy } from '../policies/LicensePolicy';
import type { DownloadRepository } from '../repositories/DownloadRepository';

export type LicenseCheckResult = { expired: number; renewed: number };

/** İnternet olanda yüklənmiş faylların lisenziyasını yoxlayır (demo: server həmişə yeniləyir). */
export class CheckLicenses {
  private readonly repository: DownloadRepository;
  private readonly engine: DownloadEngine;
  private readonly policy: LicensePolicy;

  constructor(repository: DownloadRepository, engine: DownloadEngine, policy: LicensePolicy) {
    this.repository = repository;
    this.engine = engine;
    this.policy = policy;
  }

  async execute({ isOnline }: { isOnline: boolean }): Promise<LicenseCheckResult> {
    const now = Date.now();
    const items = await this.repository.listAll();
    const result: LicenseCheckResult = { expired: 0, renewed: 0 };

    for (const item of items) {
      const state = this.policy.evaluate(item, now);

      if (state === 'expired') {
        if (item.fileUri) await this.engine.deleteFile(item.fileUri);
        await this.repository.patch(item.id, { status: 'expired', fileUri: null, updatedAt: now });
        result.expired += 1;
      } else if (state === 'needs_check' && isOnline) {
        await this.repository.patch(item.id, {
          lastLicenseCheckAt: now,
          expiresAt: this.policy.expiryFor(now),
          updatedAt: now,
        });
        result.renewed += 1;
      }
    }
    return result;
  }
}