import * as SQLite from 'expo-sqlite';

import { migrate } from './migrate';

const DATABASE_NAME = 'cineverse.db';

let instance: Promise<SQLite.SQLiteDatabase> | null = null;

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await migrate(db);
  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!instance) {
    instance = openAndMigrate().catch((error: unknown) => {
      instance = null;
      throw error;
    });
  }
  return instance;
}