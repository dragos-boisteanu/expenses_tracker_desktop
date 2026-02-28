import { Database } from 'better-sqlite3';

export default (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       content TEXT NOT NULL,
       read INTEGER CHECK(read IN (0, 1)) NOT NULL default 0,
       type TEXT CHECK(type IN ('data', 'update')) NOT NULL,
       error INTEGER CHECK(error IN (0, 1)) NOT NULL default 0,
       created_at TEXT NOT NULL
    )
  `)
};
