import { getDatabase } from '@/core/storage/sqlite/Database';

import type { DownloadItem } from '../domain/entities/DownloadItem';
import type { DownloadPatch, DownloadRepository } from '../domain/repositories/DownloadRepository';
import {
  DOWNLOAD_COLUMNS,
  toDownloadItem,
  toRowPatch,
  toRowValues,
  type DownloadRow,
} from './mappers/downloadMapper';

export class SqliteDownloadRepository implements DownloadRepository {
  async list(profileId: string): Promise<DownloadItem[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<DownloadRow>(
      'SELECT * FROM downloads WHERE profile_id = ? ORDER BY created_at DESC',
      [profileId],
    );
    return rows.map(toDownloadItem);
  }

  async listAll(): Promise<DownloadItem[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<DownloadRow>('SELECT * FROM downloads ORDER BY created_at DESC');
    return rows.map(toDownloadItem);
  }

  async get(id: string): Promise<DownloadItem | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<DownloadRow>('SELECT * FROM downloads WHERE id = ?', [id]);
    return row ? toDownloadItem(row) : null;
  }

  async find(profileId: string, titleId: string, episodeId: string | null): Promise<DownloadItem | null> {
    const db = await getDatabase();
    const row = episodeId
      ? await db.getFirstAsync<DownloadRow>(
          'SELECT * FROM downloads WHERE profile_id = ? AND title_id = ? AND episode_id = ?',
          [profileId, titleId, episodeId],
        )
      : await db.getFirstAsync<DownloadRow>(
          'SELECT * FROM downloads WHERE profile_id = ? AND title_id = ? AND episode_id IS NULL',
          [profileId, titleId],
        );
    return row ? toDownloadItem(row) : null;
  }

  async save(item: DownloadItem): Promise<void> {
    const db = await getDatabase();
    const placeholders = DOWNLOAD_COLUMNS.map(() => '?').join(',');
    await db.runAsync(
      `INSERT OR REPLACE INTO downloads (${DOWNLOAD_COLUMNS.join(',')}) VALUES (${placeholders})`,
      toRowValues(item),
    );
  }

  async patch(id: string, patch: DownloadPatch): Promise<void> {
    const row = toRowPatch(patch);
    const keys = Object.keys(row);
    if (keys.length === 0) return;

    const db = await getDatabase();
    const assignments = keys.map((key) => `${key} = ?`).join(', ');
    await db.runAsync(`UPDATE downloads SET ${assignments} WHERE id = ?`, [
      ...keys.map((key) => row[key] as string | number | null),
      id,
    ]);
  }

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM downloads WHERE id = ?', [id]);
  }
}