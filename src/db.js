import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDb() {
  const db = await open({ filename: 'data.db', driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      steps TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS campaign_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      assigned_at DATETIME NOT NULL,
      FOREIGN KEY(campaign_id) REFERENCES campaigns(id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_assignment_id INTEGER NOT NULL,
      step_index INTEGER NOT NULL,
      status TEXT NOT NULL,
      scheduled_at DATETIME NOT NULL,
      sent_at DATETIME,
      FOREIGN KEY(campaign_assignment_id) REFERENCES campaign_assignments(id)
    );
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      code TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME NOT NULL
    );
  `);
  return db;
}
