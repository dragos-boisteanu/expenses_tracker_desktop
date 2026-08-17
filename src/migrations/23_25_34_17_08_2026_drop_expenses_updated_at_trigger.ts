import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`DROP TRIGGER IF EXISTS expenses_updated_at`)
}
