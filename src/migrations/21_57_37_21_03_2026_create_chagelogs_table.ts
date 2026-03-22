import { Database } from 'better-sqlite3';

export default (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT ,
      version  REAL NOT NULL,
      description TEXT,
      date TEXT NOT NULL
    )
  `)
};
