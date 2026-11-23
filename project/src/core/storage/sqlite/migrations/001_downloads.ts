import type { Migration } from '../migrate';

export const migration001Downloads: Migration = {
  version: 1,
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY NOT NULL,
        title_id TEXT NOT NULL,
        episode_id TEXT,
        profile_id TEXT NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        quality TEXT NOT NULL,
        status TEXT NOT NULL,
        progress REAL NOT NULL DEFAULT 0,
        bytes_total INTEGER NOT NULL DEFAULT 0,
        bytes_downloaded INTEGER NOT NULL DEFAULT 0,
        file_uri TEXT,
        source_url TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        expires_at INTEGER,
        last_license_check_at INTEGER
      );
      CREATE INDEX IF NOT EXISTS idx_downloads_title ON downloads(title_id);
      CREATE INDEX IF NOT EXISTS idx_downloads_profile ON downloads(profile_id);
      CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
    `);
  },
};