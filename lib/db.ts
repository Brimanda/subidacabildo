import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = process.env.DATABASE_PATH || 'data/municipio.db';

export const openDb = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
};
