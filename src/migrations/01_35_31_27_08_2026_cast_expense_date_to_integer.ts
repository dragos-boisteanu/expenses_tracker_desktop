import { Database } from 'better-sqlite3'

export default (db: Database) => {
  db.exec(`
    UPDATE expenses
    SET date = CAST(date AS INTEGER)
    WHERE typeof(date) = 'text';
  `)
}
