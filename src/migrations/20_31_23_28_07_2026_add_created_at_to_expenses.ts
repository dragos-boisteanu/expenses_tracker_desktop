import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    ALTER TABLE expenses
    ADD COLUMN created_at INTEGER;
  `)
}
