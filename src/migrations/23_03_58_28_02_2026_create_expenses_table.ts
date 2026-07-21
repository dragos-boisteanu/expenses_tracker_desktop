import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT ,
      value  INTEGER NOT NULL,
      currency TEXT,
      date TEXT NOT NULL
    )
  `)
}
