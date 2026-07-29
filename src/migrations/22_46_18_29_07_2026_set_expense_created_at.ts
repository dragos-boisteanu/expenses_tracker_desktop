import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    UPDATE expenses
    SET created_at = date
    WHERE created_at IS NULL;
  `)
}
